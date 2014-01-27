package services

import play.api.mvc.{Action, Controller}
import play.modules.reactivemongo.MongoController
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Logger
import play.modules.reactivemongo.json.BSONFormats
import play.api.libs.json._
import scala.concurrent.Future
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.collection.JSONCollection

object Groups
  extends Controller
          with MongoController {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  protected def collection = db.collection[JSONCollection]("groups0")

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
