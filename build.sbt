name := "team-awesome-wedding"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  "org.reactivemongo" %% "play2-reactivemongo" % "0.10.2",
  "org.webjars" %% "webjars-play" % "2.2.1",
  "org.webjars" % "angularjs" % "1.2.11",
  "org.webjars" % "jquery" % "2.1.0-1",
  "org.webjars" % "momentjs" % "2.5.0",
  "org.webjars" % "requirejs" % "2.1.10",
  "org.webjars" % "requirejs-plugins" % "3ff54566f8",
  "org.webjars" % "requirejs-text" % "2.0.10",
  "org.webjars" % "restangular" % "1.3.1",
  "org.webjars" % "underscorejs" % "1.5.2-2"
)

play.Project.playScalaSettings

routesImport += "support.Binders._"
