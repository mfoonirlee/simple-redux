echo "=> Transpiling 'src' into ES5 ..."
echo ""
rm -rf ./dist
NODE_ENV=production babel src -d dist 
echo ""
echo "=> Transpiling completed."
echo "Begin log result:"
node ./dist/index.js