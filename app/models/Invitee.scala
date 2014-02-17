package models

import reactivemongo.bson.BSONObjectID
import play.api.libs.json.{JsValue, JsObject, Json}
import play.modules.reactivemongo.json.BSONFormats

case class Invitee(
  _id: Option[BSONObjectID] = None,
  group: Option[JsObject],
  name: Option[String],
  attending: Option[Boolean],
  flags: Option[JsValue]
)

object Invitee {
  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  implicit val format = Json.format[Invitee]
}
