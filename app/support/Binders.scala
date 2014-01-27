package support

import play.api.mvc.PathBindable
import play.api.Logger
import scala.util.{Success, Failure}
import reactivemongo.bson.BSONObjectID

object Binders {

  private val logger = Logger(getClass)

  type BSONObjectID = reactivemongo.bson.BSONObjectID

  implicit def objectIdPathBindable = new PathBindable[BSONObjectID] {
    def bind(key: String, value: String) = {
      BSONObjectID.parse(value) match {
        case Success(id) => Right(id)
        case Failure(reason) => Left(reason.getMessage)
      }
    }

    def unbind(key: String, value: BSONObjectID) = value.toString()
  }

}
