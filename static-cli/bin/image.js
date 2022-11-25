import Spritesmith from 'spritesmith'
import path from 'path'
import * as utils from '../utils/node.js'

function initSprite() {}


export default function initImage(program) {
    program.command('image')
    .option('-in, --input <string>', '需要处理的文件目录(A directory of files to process)', process.cwd())
    .action((file,commander)=>{
        const url = path.join(file.input,'images')
        const images = utils.getAllFile(url)

        var spritesmith = new Spritesmith();
        spritesmith.createImages(images.raw, function handleImages (err, images) {
            // Create our result
            var result = spritesmith.processImages(images);

            console.log('images',images,result)
        });
        // console.log('image cmd', file,images)
    })
}
