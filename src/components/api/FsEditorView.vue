<template>
    <el-container>
        <el-main>
            <Split direction="vertical" style="overflow: hidden;" @onDragEnd="onDragEnd">
                <SplitArea :size="debug.show?55:100" :minSize="0" style="overflow:hidden;">
                    <editor
                        v-model="editor.value"
                        @init="onEditorInit"
                        :lang="editor.lang.value"
                        :theme="editor.theme.value"
                        width="inherit"
                        :height="editor.height"
                        ref="editorRef"
                    ></editor>
                </SplitArea>
                <SplitArea :size="debug.show?45:0" :minSize="0" style="overflow:hidden;">
                    <el-tabs v-model="debug.tabs.activeIndex" type="border-card" closable>
                        <el-tab-pane name="log">
                            <span slot="label">日志 <i class="el-icon-date"></i></span>
                            <LogView :fullname="model.data.fullname" logType="serverjs"></LogView> 
                        </el-tab-pane>
                        <el-tab-pane name="result">
                            <span slot="label">结果 
                                <span v-if="model.data.output">(耗时：{{model.data.output.consume}})</span>
                            </span>
                            <el-container style="height:calc(100vh - 450px);">
                                <el-main>
                                    <vue-json-editor :value="model.data.output" :show-btns="false" :expandedOnStart="false" style="height:100%;"></vue-json-editor>
                                </el-main>
                            </el-container>
                        </el-tab-pane>
                    </el-tabs>
                </SplitArea>
            </Split>
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';
import LogView from '../consolelog/LogView';
import vueJsonEditor from 'vue-json-editor'

export default {
    name: "FsEditorView",
    props: {
        model: Object
    },
    components:{
        editor: require("vue2-ace-editor"),
        LogView,
        vueJsonEditor
    },
    data(){
        return {
            editor: {
                value: "",
                loading: false,
                lang: {
                    value: "javascript",
                    list: []
                },
                theme: {
                    value: "chrome",
                    list: this.m3.EDITOR_THEME
                },
                height:'calc(100vh - 103px)'
            },
            ignore: false,
            changed: false,
            debug:{
                tabs: {
                    list: [],
                    activeIndex: 'log'
                },
                show: false
            }
        }
    },
    watch:{
        'model':{
            handler(val){
                if(val){
                    this.editor.lang.value = val.data.ftype;
                    this.$nextTick(()=>{
                        this.$refs.editorRef.editor.setValue(val.content);
                    })
                }
            },
            deep: true,
            immediate:true
        },
        'editor.theme.value'(val){
            require(`brace/theme/${val}`);
            this.editor.theme.value = val;
        },
        'debug.show'(val){
            if(!val){
                this.editor.height = 'calc(100vh - 150px)';
            }
        }
    },
    created(){
        this.editor.value = this.model.content;
        /* try{
            this.editor.lang.value = _.last(this.model.key.split("."));
        }catch(err){
            // this.editor.lang.value = 'txt';
        } */
    },
    methods:{
        initEditor(){

            let editor = this.$refs.editorRef.editor;
            
            editor.on("input", ()=> {
                            
                if(this.changed) {
                    
                    /* if(!_.includes(parent.control.save.lis, this.model.key)){
                        parent.control.save.list.push(this.model.key);
                    } */
                }

            });
           
            editor.on('change', _.debounce(()=> {
                if (!this.ignore) {
                    this.changed = true;
                    this.$emit('editor:change',this.changed);
                }
                this.$emit('editor:value', this.editor.value)
            }),500);

            editor.on('mousemove', ()=> {
                editor.resize();
            });
            
        },
        onEditorInit(){
            require("brace/ext/language_tools"); //language extension prerequsite...
            require(`brace/mode/${this.editor.lang.value}`); //language
            require(`brace/snippets/${this.editor.lang.value}`); //snippet
            require(`brace/theme/${this.editor.theme.value}`); //language
            this.initEditor();
        },
        onDragEnd(size){
            let elHeight = parseInt(this.$el.offsetHeight * size[1]/100) + 145;
            this.editor.height = `calc(100vh - ${elHeight}px)`;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        background-color: #f2f2f2;
    }
    .el-main{
        overflow: hidden;
        padding: 0px;
    }
    .el-tabs--border-card {
        border: unset;
        box-shadow: unset;
    }
</style>
<style>
    .jsoneditor-vue{
        height: 100%;
    }
    div.jsoneditor{
        border: unset!important;
    }
    div.jsoneditor-menu{
        color:#333333;
        border: unset!important;
        background-color: #dddddd!important;
    }
    div.jsoneditor-menu > button, div.jsoneditor-menu > div.jsoneditor-modes > button{
        color:#333333;
    }
</style>
