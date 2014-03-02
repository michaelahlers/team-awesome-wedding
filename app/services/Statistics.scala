package services

import play.api.mvc.{Security, Action, Controller}
import play.modules.reactivemongo.MongoController
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Logger
import play.modules.reactivemongo.json.BSONFormats
import play.api.libs.json._
import play.api.libs.json.Json._
import scala.concurrent.Future
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.collection.JSONCollection
import reactivemongo.core.commands.{Update, FindAndModify}
import support.mongo.Implicits._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._
import play.api.libs.json

object Statistics
  extends Controller
          with MongoController {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  private implicit val documentFormat = BSONFormats.BSONDocumentFormat

  protected def collection = db.collection[JSONCollection]("statistics0")

  def createOne = Action.async(parse.json) {
    implicit request =>
      val transforms = {
        (__ \ 'action).json.pick.flatMap(v => (__ \ 'action).json.put(v)).orElse(Reads.pure(Json.obj())) and
          (__ \ 'reported).json.put(JsNumber(System.currentTimeMillis))
      }

      def withGroup(updates: JsObject) = {
        updates ++ request
          .session
          .get(Security.username)
          .map(BSONObjectID(_))
          .map(toJson(_))
          .map(id => obj("group" -> obj("_id" -> id)))
          .getOrElse(obj())
      }

      request.body.transform(transforms.reduce).map(withGroup) map {
        updates =>
          import support.mongo.FindAndModify

          val command = FindAndModify
            .collection(collection)
            .insert(updates)

          db.command(command).map(_.map(toJson(_)).map(Ok(_)).getOrElse(NotFound))
      } recoverTotal {
        error =>
          Future(BadRequest(JsError.toFlatJson(error)))
      }
  }
}
