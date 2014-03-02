package services

import play.api.mvc.{Action, Controller}
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

object Invitees
  extends Controller
          with MongoController {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  private implicit val documentFormat = BSONFormats.BSONDocumentFormat

  protected def collection = db.collection[JSONCollection]("invitees0")

  def upsertByName(record: JsValue): Future[JsValue] = {

    val query = obj(
      "familyName" -> record \ "familyName",
      "givenName" -> record \ "givenName"
    )

    val updates = obj(
      "$set" -> obj(
        "_order" -> record \ "_order",
        "familyName" -> record \ "familyName",
        "givenName" -> record \ "givenName",
        "group" -> record \ "group",
        "flags" -> record \ "flags"
      ),
      "$inc" -> obj("_version" -> 1)
    )

    val command = new FindAndModify(
      collection.name,
      query,
      Update(updates, fetchNewObject = true),
      true
    )

    collection.db.command(command).map(_.get)
  }

  def findByGroupId(groupId: BSONObjectID): Future[Seq[JsObject]] = {
    val query = obj(
      "group._id" -> groupId
    )

    val sort = obj(
      "_order" -> true
    )

    collection
      .find(query)
      .sort(sort)
      .cursor[JsObject]
      .collect[Seq]()
  }

  def updateOneById(id: BSONObjectID) = Action.async(parse.json) {
    implicit request =>
      val transforms = {
        (__ \ 'attending).json.pick.flatMap(v => (__ \ '$set \ 'attending).json.put(v)).orElse(Reads.pure(Json.obj())) and
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
