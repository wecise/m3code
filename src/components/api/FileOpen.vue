<template>
    <el-container>
        <el-header style="height:40px;line-height:40px;background-color:#fff;padding:0px;">
            <el-input v-model="selectedNode.fullname" v-if="selectedNode">
                <template slot="prepend">选择应用</template>
            </el-input>
        </el-header>
        <el-main>
            <el-tree 
                :data="classList"
                node-key="id"
                :props="defaultProps"
                @node-click="onNodeClick"
                :accordion="true"
                style="background-color:transparent;">
                <span slot-scope="{ data }">
                    <span class="el-icon-folder-opened" v-if="data.children.length > 0" style="color:#FFC107;"></span>
                    <span class="el-icon-tickets" v-else></span>
                    <span style="padding-left:5px;">{{ data.name }}</span>
                </span>
            </el-tree>
        </el-main>
    </el-container>
</template>

<script>

import _ from 'lodash';

export default ({
    name: "FileOpen",
    props: {
        dfsRoot: String
    },
    data(){
        return {
            classList: [],
            defaultProps: {
                children: 'children',
                label: 'alias'
            },
            node: {},
            selectedNode: null,
            form: {
                name: "",
                attr: ""
            },
            whiteList: ['dir']
        }
    },
    created(){
        const loading = this.openLoading();

        let param = encodeURIComponent(JSON.stringify({ path:this.dfsRoot, onlyDir:false, ftype: this.whiteList}));
        this.m3.callFS("/matrix/m3code/fsList.js", param).then( rtn=>{
            this.classList = rtn.message;
            loading.close();
        }).catch(()=>{
            loading.close();
        });
    },
    methods:{
        onNodeClick(node){
            this.selectedNode = node;
        }
    }
})
</script>

<style scoped>
    .el-container{
        height: 50vh!important;
    }
</style>
