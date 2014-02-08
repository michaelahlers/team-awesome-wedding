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

object Groups
  extends Controller
          with MongoController {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

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

  private def findOneById(id: BSONObjectID): Future[Option[JsObject]] = {
    implicit def objectIdFormat = play.modules.reactivemongo.json.BSONFormats.BSONObjectIDFormat

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
}
