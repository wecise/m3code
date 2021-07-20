<template>
    <el-container>
        <el-main align="center" class="container">
            
            <h2> 欢迎使用 M³ 规则管理</h2>

            <p>
                                        
                <el-button style="width:100px;height:90px;">
                    <i class="el-icon-money" style="font-size:48px;"></i> <p>全局配置</p>
                </el-button>

                <el-button style="width:100px;height:90px;">
                    <i class="el-icon-office-building" style="font-size:48px;"></i> <p>服务器组管理</p>
                </el-button>
                
                <el-button style="width:100px;height:90px;">
                    <i class="el-icon-postcard" style="font-size:48px;"></i> <p>作业定义</p>
                </el-button>
            
                <el-button style="width:100px;height:90px;">
                    <i class="el-icon-s-data" style="font-size:48px;"></i> <p>规则管理</p>
                </el-button>

                <el-button style="width:100px;height:90px;">
                    <i class="el-icon-lock" style="font-size:48px;"></i> <p>全局锁</p>
                </el-button>

                <el-button style="width:100px;height:90px;">
                    <i class="el-icon-warning-outline" style="font-size:48px;"></i> <p>通知设置</p>
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