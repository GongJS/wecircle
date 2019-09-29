import { Controller } from 'egg';
import { EggFile } from 'egg-multipart';
const fs = require('mz/fs');
const path = require('path');
const pump = require('mz-modules/pump');
const gm = require('gm');
interface File extends  EggFile {
  fieldname?:string
}
const hanldeImage = (filePath) => {
  return new Promise((resolve, reject) => {
    gm(filePath).size((err,size) => {
      if (!err) {
        resolve({width:size.width, height:size.height})
      } else {
        reject(err)
      }
    })
  })
}
export default class UploadController extends Controller {
  public async upload() {
    const { ctx } = this;
    let height: number
    let width: number
    let imageRes
    const file:File = ctx.request.files[0];
    if (!file) return ctx.throw(404);
    const basename = path.basename(file.filepath)
    const filename =  basename
    const targetPath = path.join(this.config.baseDir, `app/public/uploads/${file.fieldname}`, filename);
    const source = fs.createReadStream(file.filepath);
    const target = fs.createWriteStream(targetPath);
    try {
      await pump(source, target);
      imageRes = await hanldeImage(`app/public/uploads/${file.fieldname}/${basename}`)
      height = imageRes.height
      width = imageRes.width
    } finally {
      await ctx.cleanupRequestFiles();
    }
    ctx.body= {
      code: 0,
      url:  `${ctx.origin}/public/uploads/${file.fieldname}/${basename}`,
      height,
      width
    }
  }
}
