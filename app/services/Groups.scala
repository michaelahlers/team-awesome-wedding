package services

import play.api.mvc.{Action, Controller}
import play.modules.reactivemongo.MongoController
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Logger
import play.modules.reactivemongo.json.BSONFormats
import play.api.libs.json._
import scala.concurrent.Future
import reactivemongo.bson.BSONObjectID
import play.api.libs.json.Json._
import play.modules.reactivemongo.json.collection.JSONCollection
import play.api.libs.json.JsObject
import reactivemongo.core.commands.{Update, FindAndModify}
import support.mongo.Implicits._
import play.api.libs.json.Reads._
import play.api.libs.functional.syntax._

object Groups
  extends Controller
          with MongoController {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  private implicit val documentFormat = BSONFormats.BSONDocumentFormat

  protected def collection = db.collection[JSONCollection]("groups0")

  def upsertByCode(record: JsValue): Future[JsValue] = {
    val update = obj(
      "$set" -> obj(
        "code" -> record \ "code"
      ),
      "$inc" -> obj("_version" -> 1)
    )

    val command = new FindAndModify(
      collection.name,
      obj("code" -> record \ "code"),
      Update(update, fetchNewObject = true),
      true
    )

    collection.db.command(command).map(_.get)
  }

  def findOneByCode(code: String): Future[Option[JsObject]] = {
    collection
      .find(obj("code" -> code.trim.toLowerCase))
      .cursor[JsObject]
      .headOption
  }

  def findOneById(id: BSONObjectID): Future[Option[JsObject]] = {
    collection
      .find(Json.obj("_id" -> id))
      .cursor[JsObject]
      .headOption
  }

  def retrieveOneById(id: BSONObjectID) = Action.async {
    implicit request =>
      for {
        group <- findOneById(id)
        invitees <- Invitees.findByGroupId(id)
      } yield {
        group
          .map(_ ++ Json.obj("invitees" -> invitees))
          .map(Ok(_))
          .getOrElse(NotFound)
      }
  }

  def updateOneById(id: BSONObjectID) = Action.async(parse.json) {
    implicit request =>
      val transforms = {
        (__ \ 'responded).json.pick.flatMap(v => (__ \ '$set \ 'responded).json.put(v)).orElse(Reads.pure(Json.obj())) and
          (__ \ '$inc \ '_version).json.put(JsNumber(1))
      }

      request.body.transform(transforms.reduce) map {
        updates =>
          import support.mongo.FindAndModify

          val command = FindAndModify
            .collection(collection)
            .id(id)
            .update(updates, fetchNewObject = true)

          db.command(command).map(_.map(toJson(_)).map(Ok(_)).getOrElse(NotFound))
      } recoverTotal {
        error =>
          Future(BadRequest(JsError.toFlatJson(error)))
      }
  }

}
