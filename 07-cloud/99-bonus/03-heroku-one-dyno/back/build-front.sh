mkdir -p ./dist/public

cd ../<front-folder>
export BASE_API_URL=http://localhost:8081
npm install
npm run build
cp -r ./dist/. ../<back-folder>/dist/public
