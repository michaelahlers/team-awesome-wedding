package support.mongo

import play.api.libs.json.{Json, JsValue}
import Json._
import reactivemongo.bson.BSONDocument
import play.modules.reactivemongo.json.BSONFormats._

object Implicits {
  implicit def jsvalue2bsondoc(v: JsValue): BSONDocument = v.as[BSONDocument]

  implicit def bsondoc2jsvalue(o: BSONDocument): JsValue = toJson(o)
}
