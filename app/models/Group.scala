package models

import reactivemongo.bson.BSONObjectID
import play.api.libs.json.{JsObject, Json}
import play.modules.reactivemongo.json.BSONFormats

case class Group(
  _id: Option[BSONObjectID] = None,
  invitees: Seq[JsObject] = Seq.empty
)

object Group {
  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  implicit val format = Json.format[Group]
}
