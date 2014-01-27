package services

import play.api.mvc.Controller
import play.modules.reactivemongo.MongoController
import play.api.libs.concurrent.Execution.Implicits._
import play.api.Logger
import play.modules.reactivemongo.json.BSONFormats
import play.api.libs.json._
import scala.concurrent.Future
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.collection.JSONCollection

object Invitees
  extends Controller
          with MongoController {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  protected def collection = db.collection[JSONCollection]("invitees0")

  def findByGroupId(groupId: BSONObjectID): Future[Seq[JsObject]] = {
    val query = Json.obj(
      "group._id" -> groupId
    )

    collection
      .find(query)
      .cursor[JsObject]
      .collect[Seq]()
  }
}
