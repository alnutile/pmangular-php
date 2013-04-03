#!/bin/sh
cd /var/www/pmangular/scripts 
mysqldump -uroot -pthisisit05 --database phprest > db.sql
tar czvf db.sql.tar.gz db.sql
rm db.sql
git add db.sql.tar.gz
git commit -m "db backup"

