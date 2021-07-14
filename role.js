const AccessControl = require("accesscontrol");
const ac = new AccessControl();



exports.roles = (function() {
  ac.grant("Visitor")
    .readOwn("profile")
    .updateOwn("profile")
    

  ac.grant("Exhibitor")
      .readOwn("Stall")
      .createOwn("Stall")
      .deleteOwn("Stall")
      .updateOwn("Stall")

   


  ac.grant("Organizer")
    .createOwn("Event")
    .readOwn("Event")
    .updateOwn("Event")
    .deleteOwn("Event")
   

  ac.grant("Admin")
    .extend("Exhibitor")
    .extend("Organizer")
    .extend("Visitor")
    .readAny("Settings")
    .updateAny("Settings")
    .deleteAny("category")
    .createAny("category")
    .readAny("category")
    .updateAny("category")
    .readAny("Stall")
    .deleteAny("Stall")
    .createAny("Stall")
    

  return ac;
})();

























/*exports.roles = (function() {
  ac.grant("Visitor")
    .readOwn("profile")
    .updateOwn("profile")
    .readOwn("media")
   
  ac.grant("Author")
    .extend("User")
    .readAny("profile")
    .readAny("contact")
    .createAny("category")
    .readAny("category")
    .updateAny("category")
    .readAny("comment")
    .readAny("post")
    .createAny("post")
    .updateAny("post")
    .createAny("tag")
    .updateAny("tag")
    .readAny("tag")
    .readAny("media")
    .updateAny("media")
    .deleteAny("media")
    .deleteAny("newsletter")
    .createAny("newsletter")
    .updateAny("newsletter")
    .readAny("newsletter")

   

  ac.grant("Admin")
    .extend("User")
    .extend("Author")
    .createAny("contact")
    .updateAny("contact")
    .deleteAny("contact")
    .updateAny("profile")
    .deleteAny("profile")
    .deleteAny("category")
    .updateAny("comment")
    .deleteAny("comment")
    .createAny("comment")
    .deleteAny("post")
    .deleteAny("tag")
    .updateAny("Settings")
    .readAny("Settings")
    .readAny("view")
    .updateAny("view")
  return ac;
})();*/