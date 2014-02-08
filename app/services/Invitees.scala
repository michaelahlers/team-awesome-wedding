package services

import play.api.mvc.Controller
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

object Invitees
  extends Controller
          with MongoController {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  private implicit val documentFormat = BSONFormats.BSONDocumentFormat

  protected def collection = db.collection[JSONCollection]("invitees0")

  def upsertByName(record: JsValue): Future[JsValue] = {
    val update = obj(
      "$set" -> obj(
        "name" -> record \ "name",
        "group" -> record \ "group"
      ),
      "$inc" -> obj("_version" -> 1)
    )

    val command = new FindAndModify(
      collection.name,
      obj("name" -> record \ "name"),
      Update(update, fetchNewObject = true),
      true
    )

    collection.db.command(command).map(_.get)
  }

  def findByGroupId(groupId: BSONObjectID): Future[Seq[JsObject]] = {
    val query = obj(
      "group._id" -> groupId
    )

    collection
      .find(query)
      .cursor[JsObject]
      .collect[Seq]()
  }
}
