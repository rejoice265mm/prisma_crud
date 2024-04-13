import express from 'express';
import {prisma} from '../utils/prisma/index.js'

const router = express.Router(); // express.Router()를 이용해 라우터를 생성합니다.

//생성 API생성
router.post('/posts', async(req,res,next)=>{
    const {title , content , password} = req.body;

    
    const post = await prisma.posts.create({
        data:{
            title : title,
            content : content,
            password : password,
        }
    })
    //데이터 내부에 생성한 post 반환 어떻게 작동???
    return res.status(201).json({data:post});
});


//목록 API조회
router.get('/posts', async(req, res ,next)=>{
    const posts = await prisma.posts.findMany({
        //select로 지정한 목록만 조회
        select: {
            postId : true,
            title : true,
            createdAt :true,
            updatedAt : true,
        }
    });
    return res.status(201).json({data : posts})
})

//목록 상세 API 조회
router.get('/posts/:postId', async(req, res ,next)=>{
    const {postId} = req.params;
    const post = await prisma.posts.findFirst({
        where: {postId : +postId},
        select:{
            postId : true,
            title : true,
            content : true,
            createdAt :true,
            updatedAt : true,
        }
    });
    return res.status(200).json({data:post}); 
});


//수정 API 
router.put('/posts/:postId', async(req, res , next)=>{

    //어떤것을 수정할지 postId로 찾는다.
    const {postId} = req.params;

    //수정 할 것 들과 검증할 password를 body로 전달 받는다.
    const {title , content, password } = req.body;

    //수정할 것이 있는지 확인한다.
    const post = await prisma.posts.findUnique({
        //postId가 우리가 전달받은postId일때 조회
        where: {postId : +postId}
    });


    //post가 존재하지 않으면 에러
    if(!post){
        return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
        //비번이 다르면 에러
    }else if(post.password !== password){  
          return res.status(401).json({errorMessage: "비번이 다릅니다.."});
    }

    //게시글 수정하는 단계
    await prisma.posts.update({
        data:{title,content},
        where:{
            postId : +postId,
            password : password
        }
    });
    return res.status(200).json({data :"게시글이 수정되었습니다."})
});



//삭제 API 
router.delete('/posts/:postId', async(req, res , next)=>{

    //어떤것을 수정할지 postId로 찾는다.
    const {postId} = req.params;

    // password를 body로 전달 받는다.
    const { password } = req.body;

    //수정할 것이 있는지 확인한다.
    const post = await prisma.posts.findUnique({
        //postId가 우리가 전달받은postId일때 조회
        where: {postId : +postId}
    });


    //post가 존재하지 않으면 에러
    if(!post){
        return res.status(404).json({errorMessage: "게시글이 존재하지 않습니다."});
        //비번이 다르면 에러
    }else if(post.password !== password){  
        return res.status(401).json({errorMessage: "비번이 다릅니다.."});
    }


    //게시글 삭제
    await prisma.posts.delete({
        where:{
            postId : +postId,
        }
    });
    return res.status(200).json({data :"게시글이 삭제 되었습니다."})
});
export default router;