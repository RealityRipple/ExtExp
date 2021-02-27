var ExtExp =
{
 _timer: Components.classes['@mozilla.org/timer;1'].createInstance(Components.interfaces.nsITimer),
 init: function()
 {
  if (ExtExp._isLegacyEM())
  {
   ExtExp._showLegacyButton();
   document.getElementById('extensionsView').addEventListener('select', ExtExp.wait, false);
  }
  else
  {
   document.addEventListener('ViewChanged', ExtExp.showButton, true);
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
  var button = document.createElement('extExpExportButton');
  return button;
 },
 _createLegacyButton: function()
 {
  var button = document.createElement('extExpLegacyExportButton');
  return button;
 },
 _isLegacyEM: function()
 {
  // Firefox 3.6 and below
  return document.getElementById('extensionsView');
 },
 showButton: function()
 {
  var existings;
  var cb;
  var viewBox = null;
  if (document.getElementById('headered-views-content') !== null)
   viewBox = document.getElementById('headered-views-content');
  else if (document.getElementById('view-port') !== null)
   viewBox = document.getElementById('view-port');
  if (viewBox === null)
   return;
  if (viewBox.selectedPanel.id == 'list-view')
  {
   for (var i=0; i < document.getElementById('addon-list').itemCount; i++)
   {
    var item = document.getElementById('addon-list').getItemAtIndex(i);
    var controlContainer = document.getAnonymousElementByAttribute(item, 'anonid', 'control-container');
    if (controlContainer === null)
     continue;
    existings = controlContainer.getElementsByTagName('extExpExportButton');
    if (item.getAttribute('type') === 'extension' || (item.getAttribute('type') === 'theme' && item.value !== '{972ce4c6-7e08-4474-a285-3208198ce6fd}'))
    {
     if (existings.length)
     {
      cb = existings[0];
     }
     else
     {
      cb = ExtExp.createButton();
      controlContainer.insertBefore(cb, controlContainer.getElementsByClassName('remove')[0]);
     }
     cb.style.display = '-moz-box';
    }
    else
    {
     if (existings.length)
     {
      existings[0].style.display = 'none';
     }
    }
   }
   document.getElementById('addon-list').addEventListener('select', ExtExp.newButton, false);
  }
  else if (viewBox.selectedPanel.id == 'detail-view')
  {
   var detail = document.getElementById('detail-view');
   existings = detail.getElementsByTagName('extExpExportButton');
   if (detail.getAttribute('type') === 'extension' || detail.getAttribute('type') === 'theme')
   {
    if (existings.length)
    {
     cb = existings[0];
    }
    else if (document.getElementById('detail-uninstall-btn'))
    {
     cb = ExtExp.createButton();
     document.getElementById('detail-uninstall-btn').parentNode.insertBefore(cb, document.getElementById('detail-uninstall-btn'));
    }
    else if (document.getElementById('detail-enable-btn'))
    {
     cb = ExtExp.createButton();
     document.getElementById('detail-enable-btn').parentNode.insertBefore(cb, document.getElementById('detail-enable-btn'));
    }
    cb.style.display = '-moz-box';
   }
   else
   {
    if (existings.length)
    {
     existings[0].style.display = 'none';
    }
   }
  }
 },
 newButton: function()
 {
  var viewBox = null;
  if (document.getElementById('headered-views-content') !== null)
   viewBox = document.getElementById('headered-views-content');
  else if (document.getElementById('view-port') !== null)
   viewBox = document.getElementById('view-port');
  if (viewBox === null)
   return;
  if (viewBox.selectedPanel.id == 'list-view')
  {
   for (var i = 0; i < document.getElementById('addon-list').itemCount; i++)
   {
    var item = document.getElementById('addon-list').getItemAtIndex(i);
    var controlContainer = document.getAnonymousElementByAttribute(item, 'anonid', 'control-container');
    if (controlContainer === null)
     continue;
    var existings = controlContainer.getElementsByTagName('extExpExportButton');
    if (item.getAttribute('type') === 'extension' || (item.getAttribute('type') === 'theme' && item.value !== '{972ce4c6-7e08-4474-a285-3208198ce6fd}'))
    {
     var cb;
     if (existings.length)
     {
      cb = existings[0];
     }
     else
     {
      cb = ExtExp.createButton();
      controlContainer.insertBefore(cb, controlContainer.getElementsByClassName('remove')[0]);
     }
     cb.style.display = '-moz-box';
    }
    else
    {
     if (existings.length)
     {
      existings[0].style.display = 'none';
     }
    }
   }
  }
 },
 _showLegacyButton: function()
 {
  if(document.getElementById('exportButtonOn'))
  {
   ExtExp._timer.cancel();
   return;
  }
  if (ExtExp.exportButton && ExtExp.exportButton.parentNode)
  {
   ExtExp.exportButton.parentNode.removeChild(ExtExp.exportButton);
  }
  var elemExtension = document.getElementById('extensionsView').selectedItem;
  if (!elemExtension)
   return;
  var elemSelectedButtons = document.getAnonymousElementByAttribute(elemExtension, 'anonid', 'selectedButtons');
  if (!elemSelectedButtons)
   return;
  if (!ExtExp.exportButton)
   ExtExp.exportButton = ExtExp._createLegacyButton();
  for (var i=0; i<elemSelectedButtons.childNodes.length; i++)
  {
   if (elemSelectedButtons.childNodes[i] && elemSelectedButtons.childNodes[i].nodeType == Node.ELEMENT_NODE && elemSelectedButtons.childNodes[i].getAttribute('class').match(/optionsButton/))
   {
    ExtExp.exportButton.id='exportButtonOn';
    elemSelectedButtons.insertBefore(ExtExp.exportButton, elemSelectedButtons.childNodes[i]);
    break;
   }
  }
 },
 exportAll: function()
 {
  function getExt(extID)
  {
   var profPath = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('ProfD', Components.interfaces.nsIFile).path;
   var extFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   extFile.initWithPath(profPath);
   extFile.appendRelativePath('extensions');
   extFile.appendRelativePath(extID + '.xpi');
   if (extFile.exists())
    return extFile.path;

   var extDir = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   extDir.initWithPath(profPath);
   extDir.appendRelativePath('extensions');
   extDir.appendRelativePath(extID);
   if (extDir.exists() && extDir.isDirectory())
    return extDir.path;

   var appPath = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties).get('CurProcD', Components.interfaces.nsIFile).path;
   var appFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   appFile.initWithPath(appPath);
   appFile.appendRelativePath('extensions');
   appFile.appendRelativePath(extID + '.xpi');
   if (appFile.exists())
    return appFile.path;

   var appDir = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   appDir.initWithPath(appPath);
   appDir.appendRelativePath('extensions');
   appDir.appendRelativePath(extID);
   if (appDir.exists() && appDir.isDirectory())
    return appDir.path;

   var extStagedFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   extStagedFile.initWithPath(profPath);
   extStagedFile.appendRelativePath('extensions');
   extStagedFile.appendRelativePath('staged');
   extStagedFile.appendRelativePath(extID + '.xpi');
   if (extStagedFile.exists())
    return extStagedFile.path;

   var extStagedDir = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   extStagedDir.initWithPath(profPath);
   extStagedDir.appendRelativePath('extensions');
   extStagedDir.appendRelativePath('staged');
   extStagedDir.appendRelativePath(extID);
   if (extStagedDir.exists() && extStagedDir.isDirectory())
    return extStagedDir.path;

   var appStagedFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   appStagedFile.initWithPath(appPath);
   appStagedFile.appendRelativePath('extensions');
   appStagedFile.appendRelativePath('staged');
   appStagedFile.appendRelativePath(extID + '.xpi');
   if (appStagedFile.exists())
    return appStagedFile.path;

   var appStagedDir = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   appStagedDir.initWithPath(appPath);
   appStagedDir.appendRelativePath('extensions');
   appStagedDir.appendRelativePath('staged');
   appStagedDir.appendRelativePath(extID);
   if (appStagedDir.exists() && appStagedDir.isDirectory())
    return appStagedDir.path;

   return false;
  }
  function getSave(extCount, sTitle)
  {
   var nsIFilePicker = Components.interfaces.nsIFilePicker;
   var fp = Components.classes['@mozilla.org/filepicker;1'].createInstance(nsIFilePicker);
   fp.init(window, sTitle.replace('%1', extCount), nsIFilePicker.modeGetFolder);
   fp.appendFilter('Cross Platform Installer', '*.xpi');
   //fp.defaultString = extName.replace(new RegExp(' ', 'g'), '-');
   fp.defaultExtension = 'xpi';
   if (fp.show() === 1)
    return false;
   return fp.file.path;
  }
  function addFolderContentsToZip(zipW, folder, root)
  {
   var entries = folder.directoryEntries;
   while(entries.hasMoreElements())
   {
    var entry = entries.getNext();
    entry.QueryInterface(Components.interfaces.nsIFile);
    zipW.addEntryFile(root + entry.leafName, 9, entry, false);
    if (entry.isDirectory())
     addFolderContentsToZip(zipW, entry, root + entry.leafName + '/');
   }
  }
  function saveExt(fromPath, toPath)
  {
   var fFrom = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
   fFrom.initWithPath(fromPath);
   if (!fFrom.exists())
    return false;
   if (fFrom.isDirectory())
   {
    var fTo = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
    fTo.initWithPath(toPath);
    if (fTo.exists())
     fTo.remove(false);
    var zipWriter = Components.classes['@mozilla.org/zipwriter;1'].createInstance(Components.interfaces.nsIZipWriter);
    zipWriter.open(fTo, 42);
    addFolderContentsToZip(zipWriter, fFrom, '');
    zipWriter.close();
    return true;
   }
   else
   {
    var fTo = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
    fTo.initWithPath(toPath);
    var fToDir  = fTo.parent;
    var fToName = fTo.leafName;
    if (fTo.exists())
     fTo.remove(false);
    fFrom.copyTo(fToDir, fToName);
    return true;
   }
  }

  var gBundle = Components.classes['@mozilla.org/intl/stringbundle;1'].getService(Components.interfaces.nsIStringBundleService);
  var locale = gBundle.createBundle('chrome://extexp/locale/extexp.properties');
  var lclSave_Title = locale.GetStringFromName('save.all_title');
  //var lclAlert_BadID = locale.GetStringFromName('alert.badid');
  //var lclAlert_NoDefault = locale.GetStringFromName('alert.nodefault');
  //var lclAlert_NoLocation = locale.GetStringFromName('alert.nolocation');
  //var lclAlert_Failure = locale.GetStringFromName('alert.failure');
  var lclAlert_None = locale.GetStringFromName('alert.all_none');
  var lclAlert_Problem = locale.GetStringFromName('alert.all_problem');
  var lclAlert_Failure = locale.GetStringFromName('alert.all_failure');
  var lclAlert_Success = locale.GetStringFromName('alert.all_success');

  var expList = [];
  var listBox = document.getElementById('addon-list');
  for (var i = 0; i < listBox.itemCount; i++)
  {
   var child = document.getElementById('addon-list').getItemAtIndex(i);
   if (child.hasAttribute('name'))
   {
    var extName = child.getAttribute('name');
    var extID = child.value;
    if (extID === '{972ce4c6-7e08-4474-a285-3208198ce6fd}')
     continue;
    if (extID === '{00000000-0000-0000-0000-000000000000}')
     continue;
    var extPath = getExt(extID);
    if (extPath === false)
     continue;
    var extVer = '0.0';
    if (typeof child._version !== 'undefined' && child._version !== null && child._version.hasAttribute('value'))
     extVer = child._version.getAttribute('value');
    if (typeof child.mAddon !== undefined && child.mAddon.version !== null)
     extVer = child.mAddon.version;
    var ext = {name: extName, version: extVer, id: extID, path: extPath};
    expList.push(ext);
   }
  }
  if (expList.length === 0)
  {
   alert(lclAlert_None);
   return;
  }
  var savePath = getSave(expList.length, lclSave_Title);
  if (savePath !== false)
  {
   var failList = [];
   for (var e = 0; e < expList.length; e++)
   {
    var saveName = expList[e].name.replace(new RegExp(' ', 'g'), '-') + '-v' + expList[e].version + '.xpi';
    saveName = saveName.replace(/[/\\?%*:|"<>]/g, '-');
    saveName = OS.Path.join(savePath, saveName);
    if (saveExt(expList[e].path, saveName) === false)
     failList.push(expList[e].name);
   }
   if (failList.length > 0)
   {
    var okCount = expList.length;
    var badCount = failList.length;
    okCount -= badCount;
    if (okCount > 0)
     alert(lclAlert_Problem.replace('%1', okCount).replace('%2', savePath).replace('%3', badCount));
    else
     alert(lclAlert_Failure.replace('%1', badCount).replace('%2', savePath));
   }
   else
    alert(lclAlert_Success.replace('%1', expList.length).replace('%2', savePath));
  }
 }
};
addEventListener('load', ExtExp.init, false);
