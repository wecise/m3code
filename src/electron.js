// 此处设置入口页面
mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../app/matrix/m3code/index.html'),// 更改了这
    protocol: 'file:',
    slashes: true
  }))