<template>
    <el-container>
        <el-main align="center" class="container">
            
            <h2> 欢迎使用 M³ 在线编辑器</h2>

            <p>
                                        
                <el-button type="text" style="width:100px;height:90px;">
                    <i class="el-icon-document" style="font-size:48px;"></i> <p>打开文件</p>
                </el-button>
            
                <el-button type="text" style="width:100px;height:90px;">
                    <i class="el-icon-folder-opened" style="font-size:48px;"></i> <p>新建文件夹</p>
                </el-button>

                <el-button type="text" style="width:100px;height:90px;">
                    <i class="el-icon-document" style="font-size:48px;"></i> <p>新建文件</p>
                </el-button>
            
            </p>

            <p>
                <el-image :src="require('@/assets/svg/configWorld.svg')">
                    <div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                    </div>
                </el-image>
            </p>
            <p>
                如有任何意见或建议，请及时反馈给我们。 
                Email：m3@wecise.com
            </p>
        </el-main>
    </el-container>
</template>

<script>

export default {
    name: "Welcome"    
}
</script>

<style scoped>
    .el-container{
        background: #ffffff!important;
    }
    .el-image{
        width:50vw;
    }
</style>