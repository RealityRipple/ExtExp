var ExtExp =
{
 _timer: Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer),
 init: function()
 {
  if (ExtExp._isLegacyEM())
  {
   ExtExp._showLegacyButton();
   document.getElementById("extensionsView").addEventListener("select", ExtExp.wait, false);
  }
  else
  {
   document.addEventListener("ViewChanged", ExtExp.showButton, true);
   ExtExp.showButton();
  }
 },
 wait: function()
 {
  ExtExp._showLegacyButton();
  ExtExp._timer.initWithCallback(ExtExp.event, 1, Components.interfaces.nsITimer.TYPE_REPEATING_SLACK);
 },
 event: 
 {
  notify: function(_timer)
  {
   ExtExp._showLegacyButton();
  }
 },
 createButton: function()
 {
  var button = document.createElement("extExpExportButton");
  return button;
 },
 _createLegacyButton: function()
 {
  var button = document.createElement("extExpLegacyExportButton");
  return button;
 },
 _isLegacyEM: function()
 {
  // Firefox 3.6 and below
  return document.getElementById("extensionsView");
 },
 showButton: function()
 {
  var existings;
  var cb;
  if (document.getElementById("view-port").selectedPanel.id == "list-view")
  {
   for (var i=0; i < document.getElementById("addon-list").itemCount; i++)
   {
    var item = document.getElementById("addon-list").getItemAtIndex(i);
    var controlContainer = document.getAnonymousElementByAttribute(item, 'anonid', 'control-container');
    existings = controlContainer.getElementsByTagName("extExpExportButton");
    if (item.getAttribute("type") === "extension" || (item.getAttribute("type") === "theme" && item.value !== "{972ce4c6-7e08-4474-a285-3208198ce6fd}"))
    {
     if (existings.length)
     {
      cb = existings[0];
     }
     else
     {
      cb = ExtExp.createButton();
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
   document.getElementById("addon-list").addEventListener('select', ExtExp.newButton, false);
  }
  else if (document.getElementById("view-port").selectedPanel.id == "detail-view")
  {
   var detail = document.getElementById("detail-view");
   existings = detail.getElementsByTagName("extExpExportButton");
   if (detail.getAttribute("type") === "extension" || detail.getAttribute("type") === "theme")
   {
    if (existings.length)
    {
     cb = existings[0];
    }
    else if (document.getElementById("detail-uninstall-btn"))
    {
     cb = ExtExp.createButton();
     document.getElementById("detail-uninstall-btn").parentNode.insertBefore(cb, document.getElementById("detail-uninstall-btn"));
    }
    else if (document.getElementById("detail-enable-btn"))
    {
     cb = ExtExp.createButton();
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
 },
 newButton: function()
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
      cb = ExtExp.createButton();
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
 },
 _showLegacyButton: function()
 {
  if(document.getElementById("exportButtonOn"))
  {
   ExtExp._timer.cancel();
   return;
  }
  if (ExtExp.exportButton && ExtExp.exportButton.parentNode)
  {
   ExtExp.exportButton.parentNode.removeChild(ExtExp.exportButton);
  }
  var elemExtension = document.getElementById("extensionsView").selectedItem;
  if (!elemExtension)
   return;
  var elemSelectedButtons = document.getAnonymousElementByAttribute(elemExtension, "anonid", "selectedButtons");
  if (!elemSelectedButtons)
   return;
  if (!ExtExp.exportButton)
   ExtExp.exportButton = ExtExp._createLegacyButton();
  for (var i=0; i<elemSelectedButtons.childNodes.length; i++)
  {
   if (elemSelectedButtons.childNodes[i] && elemSelectedButtons.childNodes[i].nodeType == Node.ELEMENT_NODE && elemSelectedButtons.childNodes[i].getAttribute("class").match(/optionsButton/))
   {
    ExtExp.exportButton.id="exportButtonOn";
    elemSelectedButtons.insertBefore(ExtExp.exportButton, elemSelectedButtons.childNodes[i]);
    break;
   }
  }
 }
};
addEventListener("load", ExtExp.init, false);
