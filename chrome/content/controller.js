if (!com) var com = {};
if (!com.RealityRipple) com.RealityRipple = {};
com.RealityRipple.ExtExp = function()
{
 var pub = {};
 var priv = {};

 pub.init = function()
 {
  if (priv.isLegacyEM())
  {
   priv.showLegacyButton();
   document.getElementById("extensionsView").addEventListener("select", com.RealityRipple.ExtExp.wait, false);
  }
  else
  {
   document.addEventListener("ViewChanged", com.RealityRipple.ExtExp.showButton, true);
   com.RealityRipple.ExtExp.showButton();
  }
 }

 priv.timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);

 pub.wait = function()
 {
  priv.showLegacyButton();
  priv.timer.initWithCallback(com.RealityRipple.ExtExp.event, 1, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
 }

 pub.event = 
 {
  notify: function(timer)
  {
   priv.showLegacyButton();
  }
 }

 priv.createButton = function()
 {
  var button = document.createElement("extExpExportButton");
  return button;
 }

 priv.createLegacyButton = function()
 {
  var button = document.createElement("extExpLegacyExportButton");
  return button;
 }

 priv.isLegacyEM  = function()
 {
  // Firefox 3.6 and below
  return document.getElementById("extensionsView");
 }

 pub.showButton = function()
 {
  var stuffer = function()
  {
   if (document.getElementById("view-port").selectedPanel.id == "list-view")
   {
    for (var i=0; i < document.getElementById("addon-list").itemCount; i++)
    {
     var item = document.getElementById("addon-list").getItemAtIndex(i);
     var controlContainer = document.getAnonymousElementByAttribute(item, 'anonid', 'control-container');
     var existings = controlContainer.getElementsByTagName("extExpExportButton");
     if (item.getAttribute("type") === "extension" || (item.getAttribute("type") === "theme" && item.value !== "{972ce4c6-7e08-4474-a285-3208198ce6fd}"))
     {
      var cb;
      if (existings.length)
      {
       cb = existings[0];
      }
      else
      {
       cb = priv.createButton();
       controlContainer.insertBefore(cb, controlContainer.getElementsByClassName("remove")[0]);
      }
      cb.style.display = "-moz-box";
     }
     else
     {
      if (existings.length)
      {
       existings[0].style.display = "none";
      }
     }
    }
    document.getElementById("addon-list").addEventListener('select', com.RealityRipple.ExtExp.newButton, false);
   }
   else if (document.getElementById("view-port").selectedPanel.id == "detail-view")
   {
    var detail = document.getElementById("detail-view");
    var existings = detail.getElementsByTagName("extExpExportButton");
    if (detail.getAttribute("type") === "extension" || detail.getAttribute("type") === "theme")
    {
     var cb;
     if (existings.length)
     {
      cb = existings[0];
     }
     else if (document.getElementById("detail-uninstall-btn"))
     {
      cb = priv.createButton();
      document.getElementById("detail-uninstall-btn").parentNode.insertBefore(cb, document.getElementById("detail-uninstall-btn"));
     }
     else if (document.getElementById("detail-enable-btn"))
     {
      cb = priv.createButton();
      document.getElementById("detail-enable-btn").parentNode.insertBefore(cb, document.getElementById("detail-enable-btn"));
     }
     cb.style.display = "-moz-box";
    }
    else
    {
     if (existings.length)
     {
      existings[0].style.display = "none";
     }
    }
   }
  }
  stuffer();
 }

 pub.newButton = function()
 {
  var stuffer = function()
  {
   if (document.getElementById("view-port").selectedPanel.id == "list-view")
   {
    for (var i = 0; i < document.getElementById("addon-list").itemCount; i++)
    {
     var item = document.getElementById("addon-list").getItemAtIndex(i);
     var controlContainer = document.getAnonymousElementByAttribute(item, 'anonid', 'control-container');
     var existings = controlContainer.getElementsByTagName("extExpExportButton");
     if (item.getAttribute("type") === "extension" || (item.getAttribute("type") === "theme" && item.value !== "{972ce4c6-7e08-4474-a285-3208198ce6fd}"))
     {
      var cb;
      if (existings.length)
      {
       cb = existings[0];
      }
      else
      {
       cb = priv.createButton();
       controlContainer.insertBefore(cb, controlContainer.getElementsByClassName("remove")[0]);
      }
      cb.style.display = "-moz-box";
     }
     else
     {
      if (existings.length)
      {
       existings[0].style.display = "none";
      }
     }
    }
   }
  }
  stuffer();
 }

 priv.showLegacyButton = function()
 {
  if(document.getElementById("exportButtonOn"))
  {
   priv.timer.cancel();
   return;
  }
  if (priv.exportButton && priv.exportButton.parentNode)
  {
   priv.exportButton.parentNode.removeChild(priv.exportButton);
  }
  var elemExtension = document.getElementById("extensionsView").selectedItem;
  if (!elemExtension)
   return;
  var elemSelectedButtons = document.getAnonymousElementByAttribute(elemExtension, "anonid", "selectedButtons");
  if (!elemSelectedButtons)
   return;
  if (!priv.exportButton)
   priv.exportButton = priv.createLegacyButton();
  for (var i=0; i<elemSelectedButtons.childNodes.length; i++)
  {
   if (elemSelectedButtons.childNodes[i] && elemSelectedButtons.childNodes[i].nodeType == Node.ELEMENT_NODE
       && elemSelectedButtons.childNodes[i].getAttribute("class").match(/optionsButton/))
   {
    priv.exportButton.id="exportButtonOn";
    elemSelectedButtons.insertBefore(priv.exportButton, elemSelectedButtons.childNodes[i]);
    break;
   }
  }
 }

 return pub;
}();

addEventListener("load", com.RealityRipple.ExtExp.init, false);
