#1 Change Constants.ts to uncomment the right URLS.
#2 Increase memory size: export NODE_OPTIONS="--max-old-space-size=8192"
#3 Build: ng build --prod --aot
#4: Delete old backups under ROOT/backups
#4: Backup files under ROOT into backups folder. DO NOT backup assets (too big)
#5: Deploy the the new builds
