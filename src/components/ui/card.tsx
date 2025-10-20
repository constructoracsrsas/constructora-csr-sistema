20:43:26.439 
x Build failed in 435ms
20:43:26.439 
error during build:
20:43:26.439 
[vite:esbuild] Transform failed with 1 error:
20:43:26.440 
/vercel/path0/src/components/ui/card.tsx:79:0: ERROR: Expected "}" but found end of file
20:43:26.440 
file: /vercel/path0/src/components/ui/card.tsx:79:0
20:43:26.440 
20:43:26.440 
Expected "}" but found end of file
20:43:26.440 
77 |  
20:43:26.440 
78 |  export { Card, CardHeader, CardFooter, CardTitle, Card
20:43:26.440 
79 |  
20:43:26.440 
   |  ^
20:43:26.440 
20:43:26.440 
    at failureErrorWithLog (/vercel/path0/node_modules/esbuild/lib/main.js:1472:15)
20:43:26.440 
    at /vercel/path0/node_modules/esbuild/lib/main.js:755:50
20:43:26.440 
    at responseCallbacks.<computed> (/vercel/path0/node_modules/esbuild/lib/main.js:622:9)
20:43:26.440 
    at handleIncomingPacket (/vercel/path0/node_modules/esbuild/lib/main.js:677:12)
20:43:26.440 
    at Socket.readFromStdout (/vercel/path0/node_modules/esbuild/lib/main.js:600:7)
20:43:26.440 
    at Socket.emit (node:events:519:28)
20:43:26.440 
    at addChunk (node:internal/streams/readable:561:12)
20:43:26.441 
    at readableAddChunkPushByteMode (node:internal/streams/readable:512:3)
20:43:26.441 
    at Readable.push (node:internal/streams/readable:392:5)
20:43:26.441 
    at Pipe.onStreamRead (node:internal/stream_base_commons:189:23)
20:43:26.458 
Error: Command "npm run build" exited with 1
