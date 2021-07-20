<template>
    <el-container>
        <el-main>
            <Split direction="vertical" :gutterSize="5" @onDragEnd="onDragEnd">
                <SplitArea :size="debug.show?55:100" :minSize="0" style="overflow:hidden;">
                    <Editor
                        v-model="editor.value"
                        @init="onEditorInit"
                        :lang="editor.lang.value"
                        :theme="editor.theme.value"
                        width="100%"
                        :height="editor.height"
                        ref="editorRef"
                    ></Editor>
                </SplitArea>
                <SplitArea :size="debug.show?45:0" :minSize="0" style="overflow:hidden;">
                    <el-tabs v-model="debug.tabs.activeIndex" type="border-card" closable>
                        <el-tab-pane name="log">
                            <span slot="label">日志 <i class="el-icon-date"></i></span>
                            <LogView :fullname="model.key" logType="rule"></LogView> 
                        </el-tab-pane>
                        <el-tab-pane label="测试" name="debug">
                            <TestView :fullname="model.key"></TestView>
                        </el-tab-pane>
                        <!-- <el-tab-pane label="数据" name="data">
                            
                        </el-tab-pane> -->
                    </el-tabs>
                </SplitArea>
            </Split>
        </el-main>
    </el-container>
      
</template>
<script>
import _ from 'lodash';
import LogView from '../consolelog/LogView';
import TestView from './TestView';

export default {
    name: "EditRuleView",
    props: {
        model: Object
    },
    components:{
        Editor:require("vue2-ace-editor"),
        LogView,
        TestView
    },
    data() {
        return {
            editor: {
                value: "",
                data: null,
                loading: false,
                lang: {
                    value: "lua",
                    list: []
                },
                theme: {
                    value: "chrome",
                    list: this.m3.EDITOR_THEME
                },
                height:'calc(100vh - 153px)'
            },
            ignore: false,
            changed: false,
            etcd: {
                key: null,
                value: null,
                ttl: null,
                isDir: true
            },
            debug:{
                tabs: {
                    list: [],
                    activeIndex: 'log'
                },
                show: false
            },
            classModel: {}
        }
    },
     watch:{
        'editor.theme.value'(val){
            require(`brace/theme/${val}`);
            this.editor.theme.value = val;
        },
        'debug.show'(val){
            if(!val){
                this.editor.height = 'calc(100vh - 225px)';
            }
        }
    },
    created(){
        
        this.editor.value = this.model.value;
        
        if(_.startsWith(this.model.key,"/matrix/jobs") || _.includes(this.model.key,"/jobs")){
            this.editor.lang.value = "toml";
        }

        if(_.includes(this.model.key,".json")){
            this.editor.lang.value = "json";
        }

        if(_.includes(this.model.key,"/etc/")){
            this.editor.lang.value = "ini";
        }

        try{
            let name = _.trim(_.split(_.first(this.model.value.match(/^--class.*/mgi)),"=",2)[1]);
            _.extend(this.classModel, {name:name});
        } catch(err){
            _.extend(this.classModel, {name:""});
        }
        
    },
    mounted(){
        // 选择节点
        if(_.has(this.model,'key')){
            this.initEditer();
        }
    },
    methods: {
        initEditer(){

            let editor = this.$refs.editorRef.editor;
            let parent = this.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent.$parent;

            editor.on("input", ()=> {
                                    
                if(this.changed) {
                    
                    if(!_.includes(parent.control.save.lis, this.model.key)){
                        parent.control.save.list.push(this.model.key);
                    }
                }

            });
            editor.on('change', _.debounce(()=> {

                if (!this.ignore) {
                    this.changed = true;
                    this.$emit('editor:change',this.changed);
                    this.$emit('editor:value', this.editor.value)
                }
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
        },
        onDragEnd(size){
            let elHeight = parseInt(this.$el.offsetHeight * size[1]/100) + 140;
            this.editor.height = `calc(100vh - ${elHeight}px)`;
        }
    }
}
</script>

<style scoped>
    .el-container{
        margin: -35px;
    }
    .el-main{
        overflow: hidden;
    }
    .el-tabs--border-card {
        border: unset;
        box-shadow: unset;
    }

    .split{
        overflow-y: hidden!important;
    }

</style>