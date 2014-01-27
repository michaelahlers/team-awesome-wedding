package controllers

import play.api.mvc._
import play.api.Logger
import scala.concurrent.Future
import play.api.libs.concurrent.Execution.Implicits._

object Application extends Controller {

  private val logger = Logger(getClass)

  def root = Action.async {
    Future(Redirect(routes.Application.index))
  }

  def index = Action.async {
    Future(Ok(views.html.index()))
  }

}
