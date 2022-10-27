function versionWriter()
{
  var now = new Date()
  now.setDate(now.getDate() - 1);
  
  let today = {
    year : now.getFullYear(),
    month : now.getMonth()+1,
    day : now.getDate()
  };

  s22plusVersionWriter(today);
  redmi10proVersionWriter(today);
  goodnoteVersionWriter(today);
}

function s22plusVersionWriter(today) {
  var opFolders = [
    DriveApp.getFolderById('15h47joahw_rZtDhHaUbCZnmk1cq0GXsV'),
    DriveApp.getFolderById('1AVg6FnZEqeKFN4JPHBKyb0KnWZHz-BwC'),
    DriveApp.getFolderById('1cWJS996scSXlDfciz3PJkUaSQUCJ3Lzf'),
    DriveApp.getFolderById('1hjbW4sLzWVGxDUi_S3f5485vo4h3vWV4')
    ];
  var dpFolder = DriveApp.getFolderById('1Uy-GT1CaTOjZ7W7xPS9LfZlzzy_MR5D4');
  let oFolders;
  let oFolder;
  let tFolder;

  console.log(`S22+ ${today.year}-${today.month}-${today.day} 시점 백업 시작... `);

  tFolder = findDateFolderToPut(today,dpFolder);

  if (tFolder == -1)
  {
    console.log(`이미 해당 날짜의 백업 데이터가 존재합니다.`);
    return;
  }

  for (const opFolder of opFolders)
  {
    looper(opFolder, tFolder);
  }

  console.log(`S22+ 시점 백업 완료...`);
}

function redmi10proVersionWriter(today) {
  var opFolders = [
    DriveApp.getFolderById('1gof9xRjj6Mi063J7uEIV-QFYVGg-pBWE'),
    DriveApp.getFolderById('18BsDiu3ayzT5xg9NhqNk7Db9nPBp4Z_G')
    ];
  var dpFolder = DriveApp.getFolderById('1Gr4hQYhzjgDDG13xdVnssYKfk6sOzrC4');
  let oFolders;
  let oFolder;
  let tFolder;

  console.log(`홍미노트 10 Pro ${today.year}-${today.month}-${today.day} 시점 백업 시작... `);

  tFolder = findDateFolderToPut(today,dpFolder);
  
  if (tFolder == -1)
  {
    console.log(`이미 해당 날짜의 백업 데이터가 존재합니다.`);
    return;
  }

  for (const opFolder of opFolders)
  {
    looper(opFolder, tFolder);
  }

  console.log(`홍미노트 10 Pro 시점 백업 완료...`);
}

function goodnoteVersionWriter(today) {
  var opFolders = DriveApp.getFolderById('1rtYcOx7jXW1rajpOqlhNwYq_5oacOFaR').searchFolders(`title != "[시점 백업]" and title != "[전체 백업]"`);
  var dpFolder = DriveApp.getFolderById('1vR5KDdh2MeOUxOSUcOg_v7XaFJMGqY3E');

  let opFolder;
  let oFolders;
  let oFolder;
  let oFiles = DriveApp.getFolderById('1rtYcOx7jXW1rajpOqlhNwYq_5oacOFaR').getFiles();
  let oFile;

  console.log(`GoodNote ${today.year}-${today.month}-${today.day} 시점 백업 시작... `);

  var tFolder = findDateFolderToPut(today,dpFolder);
  
  if (tFolder == -1)
  {
    console.log(`이미 해당 날짜의 백업 데이터가 존재합니다.`);
    return;
  }

  while (opFolders.hasNext())
  {
    opFolder = opFolders.next();
    looper(opFolder, tFolder);
  }

  while (oFiles.hasNext())
  {
    oFile = oFiles.next();
    oFile.makeCopy(tFolder);
    console.log(`"${oFile.getName()}" 파일 백업 완료`);
  }

  console.log(`GoodNote 시점 백업 완료...`);
}

function looper(rFolder, tpFolder)
{
  var rFolderName = rFolder.getName();
  var oFolders = rFolder.getFolders();
  var oFiles = rFolder.getFiles();

  var tFolder = tpFolder.createFolder(rFolderName);

  let oFolder;
  let oFile;

  console.log(`"${rFolderName}" 폴더 백업 시작`);

  while (oFolders.hasNext())
  {
    oFolder = oFolders.next();

    looper(oFolder, tFolder);
  }

  while (oFiles.hasNext())
  {
    oFile = oFiles.next();
    oFile.makeCopy(tFolder);
    console.log(`"${oFile.getName()}" 파일 백업 완료`);
  }

  console.log(`"${rFolderName}" 폴더 백업 완료`);
}

function findDateFolderToPut(date, dpFolder)
{
  var dpFolderId = dpFolder.getId();
  var folderNameToMonth = `${date.year}년 ${date.month}월`;
  var folderNameToDay = `${date.year}년 ${date.month}월 ${date.day}일`;

  var mFolderF = DriveApp.searchFolders(`title = "${folderNameToMonth}" and parents in "${dpFolderId}"`);
  var mFolder;

  var dFolderF;

  if(mFolderF.hasNext())
  {
    mFolder = mFolderF.next();
  }
  else
  {
    mFolder = DriveApp.getFolderById(dpFolderId).createFolder(folderNameToMonth);
    console.log(`${folderNameToMonth} 폴더 생성`);
  }

  dFolderF = DriveApp.searchFolders(`title = "${folderNameToDay}" and parents in "${mFolder.getId()}"`);

  if(dFolderF.hasNext())
  {
    return -1;
  }
  else
  {
    console.log(`${folderNameToDay} 폴더 생성`);
    return mFolder.createFolder(folderNameToDay);
  }
}