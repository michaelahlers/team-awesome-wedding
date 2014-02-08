name := "team-awesome-wedding"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  "org.reactivemongo" %% "play2-reactivemongo" % "0.10.2",
  "org.webjars" %% "webjars-play" % "2.2.1",
  "org.webjars" % "angularjs" % "1.2.11",
  "org.webjars" % "bootstrap" % "3.1.0",
  "org.webjars" % "jquery" % "2.1.0-1",
  "org.webjars" % "requirejs" % "2.1.10"
)

play.Project.playScalaSettings

routesImport += "support.Binders._"
