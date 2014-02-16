package controllers

import play.api.mvc._
import play.api.Logger
import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits._
import services.Groups
import play.api.libs.json.JsValue
import reactivemongo.bson.BSONObjectID
import play.modules.reactivemongo.json.BSONFormats

object Application extends Controller {

  private val logger = Logger(getClass)

  private implicit val objectIdFormat = BSONFormats.BSONObjectIDFormat

  def root = Action.async {
    Future(Redirect(routes.Application.index))
  }

  def index = Action.async {
    Future(Ok(views.html.index()))
  }

  def enter(code: String) = Action.async {
    implicit request =>
      for {
        groupOption <- Groups.findOneByCode(code)
      } yield {
        groupOption.map {
          group =>
            Redirect(routes.Application.index)
              .withSession("group._id" -> (group \ "_id").as[BSONObjectID].stringify)
        } getOrElse {
          Unauthorized
        }
      }
  }

  def exit = Action.async {
    implicit request =>
      Future(Ok.withNewSession)
  }
}
