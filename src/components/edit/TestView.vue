<template>

    <el-container>
        <el-header style="height:30px;line-height:30px;text-align:right;">
            <el-tooltip content="重置测试内容">
                <el-button type="text" @click="onReset" icon="el-icon-refresh"></el-button>
            </el-tooltip>
            <el-tooltip content="发送测试内容">
                <el-button type="text" @click="onSubmit" icon="el-icon-s-promotion"></el-button>
            </el-tooltip>
            <el-tooltip content="文件类型">
                <el-dropdown @command="onHandleCommand" trigger="click" style="margin-left:10px;">
                    <span class="el-dropdown-link">
                        <i class="el-icon-document"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :command="item.name" :key="index" v-for="(item,index) in mode">{{item.name}}</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-tooltip>
        </el-header>
        <el-main>
            <editor
                v-model="editor.content"
                @init="onEditorInit"
                :lang="editor.lang.value"
                :theme="editor.theme.value"
                width="100%"
                height="calc(100vh - 370px)"
                style="border:1px solid #f2f2f2;"
                ref="editorRef"
            ></editor>
        </el-main>
    </el-container>
      
</template>
<script>
import _ from 'lodash';

export default {
    name: "TestView",
    props: {
        fullname: String
    },
    data() {
        return {
            editor: {
                content: "",
                lang: {
                    value: "lua",
                    list: []
                },
                theme: {
                    value: "chrome",
                    list: this.m3.EDITOR_THEME
                }
            },
            mode: null
        }
    },
    components:{
        editor:require("vue2-ace-editor")
    },
    created(){
        this.m3.callFS("/matrix/config/modeList.js",null).then( (rtn)=>{
            this.mode = rtn.message;
        });
    },
    mounted(){
        
    },
    methods: {
        onReset(){
            this.editor.content = "";
        },
        onEditorInit(){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language
        },
        onSubmit(){
            let editor = this.$refs.editorRef.editor;
            let debug = this.editor.content;
            
            if( editor.getSelectedText().length > 0 ) {
                debug = editor.getSelectedText();
            }

            if(debug.length < 1){
                this.$message({
                    type:"info",
                    message: "请输入调试信息"
                })
                return false;
            }

            let term = encodeURIComponent(JSON.stringify(_.extend({},{rule:this.fullname, term: debug})));
            this.m3.callFS("/matrix/config/forwardDebug.js",term).then( ()=>{
                this.eventHub.$emit("log-refresh");
            });
            
        },
        onHandleCommand(cmd){
            let editor = this.$refs.editorRef.editor;
            editor.session.setMode("ace/mode/"+cmd);
        }
    }
}
</script>

<style scoped>
    .el-container{
        margin: -15px!important;
    }
    .el-main{
        overflow: hidden;
        padding:0px;
    }
</style>