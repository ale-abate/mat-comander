cd ./mat-commander-server
go build -o ../dist/
cd ..

cd ./mat-commander-ui
npm run build
cd ..
