#!/usr/bin/env python3
import ftplib
import datetime


now = datetime.datetime.now()

ftp = ftplib.FTP('172.17.0.34')
ftp.login('mapa', 'dearea')
 

#ftp.dir()
#ftp.cwd(path)
with open('./backup.zip', 'rb') as f:
    ftp.storbinary('STOR ' + './backup'+now.strftime('%Y-%m-%d %H:%M:%S')+'.zip', f)
    
ftp.quit()
