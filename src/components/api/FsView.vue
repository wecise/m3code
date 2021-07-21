<template>
    <el-container>
        <el-header>
            <!-- 工具栏 -->
            <span>
                <el-tooltip content="打开">
                    <el-button type="text" icon="el-icon-folder-opened" @click="onOpen"></el-button>
                </el-tooltip>
                <el-divider direction="vertical"></el-divider>
                <el-tooltip content="新建应用">
                    <el-button type="text" icon="el-icon-folder-add" @click="onNewDir"></el-button>
                </el-tooltip>
                <el-tooltip content="新建文件">
                    <el-button type="text" icon="el-icon-document-add" @click="onNewFile"></el-button>
                </el-tooltip>    
                <el-divider direction="vertical"></el-divider>
                <el-tooltip content="重打开">
                    <el-button type="text" icon="el-icon-refresh" @click="onReload"></el-button>
                </el-tooltip>    
            </span>
            <span v-if="currentTab">
                <el-divider direction="vertical"></el-divider>
                <el-tooltip content="保存" >
                    <el-button type="text" @click="onSave">
                        <svg-icon icon-class="save"/>
                    </el-button>
                </el-tooltip>
                <span  v-if="currentTab.data.ftype=='js'">
                    <el-divider direction="vertical"></el-divider>
                    <el-tooltip content="执行" >
                        <el-button type="text" @click="onPlay" :loading="tip.loading">
                            <svg-icon icon-class="play"/>
                        </el-button>
                    </el-tooltip>
                    <!-- <el-divider direction="vertical"></el-divider>
                    <el-tooltip content="执行日志" >
                        <el-button type="text" icon="el-icon-monitor" @click="onToggleRunningView('log')"></el-button>
                    </el-tooltip>
                    <el-tooltip content="执行结果" >
                        <el-button type="text" icon="el-icon-tickets" @click="onToggleRunningView('result')"></el-button>
                    </el-tooltip> -->
                </span>
                <span v-if="currentTab.data.ftype=='html' || currentTab.data.ftype=='js' || currentTab.data.ftype=='json'">
                    <el-divider direction="vertical"></el-divider>
                    <el-tooltip content="格式化" >
                        <el-button type="text" icon="el-icon-finished" @click="onFormatContent"></el-button>
                    </el-tooltip>
                </span>
                <span v-if="currentTab.data.ftype=='html'">
                    <el-divider direction="vertical"></el-divider>
                    <el-tooltip content="预览" >
                        <el-button type="text" icon="el-icon-platform-eleme" @click="onToggleRunningView('preview')" ></el-button>
                    </el-tooltip>
                </span>
                    <el-tooltip content="选择主题">
                    <el-dropdown style="padding-left:10px;float:right;">
                        <span class="el-dropdown-link">
                            <svg-icon icon-class="theme"/>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="group in editor.theme.list" :key="group.name">
                                <el-dropdown @command="onToggleTheme">
                                    <span class="el-dropdown-link">
                                    {{ group.name }}
                                    <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item
                                            v-for="item in group.items"
                                            :key="item.name"
                                            :command="item.name">{{ item.name }}</el-dropdown-item>
                                        </el-dropdown-menu>
                                </el-dropdown>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-tooltip>
                <span style="padding-left:20px;font-size:12px;" v-if="tip.loading">{{tip.message}}</span>
            </span>
            <span style="float:right;">
                <el-tooltip content="全屏" >
                    <el-button type="text" @click="onToggleFullScreen" >
                        <svg-icon icon-class="fullscreen"/>
                    </el-button>
                </el-tooltip>
            </span>
        </el-header>
        <el-main style="padding:0px;overflow:hidden;">
            <Split direction="horizontal">
                <SplitArea :size="25" :minSize="0" style="overflow:hidden;">
                    <FileTree @node-click="(data)=>{ onTabOpen(data); }" ref="fsTree"></FileTree>
                </SplitArea>
                <SplitArea :size="75" :minSize="0" style="overflow:hidden;background:#ffffff;">
                    <el-tabs v-model="tabs.activeIndex" type="border-card" 
                        closable 
                        @tab-remove="onTabClose"
                        v-if="currentTab"
                        class="fs-tabs">
                            <el-tab-pane :name="item.data.id" :key="index" v-for="(item,index) in tabs.list">
                                <span slot="label">{{item.data.name}}</span>
                                <FsEditorView 
                                    :model="item" 
                                    :ref="'FsEditView-'+item.data.id" 
                                    @editor:value="onEditorChange"  
                                    @editor:change="(v)=>{}"></FsEditorView>
                            </el-tab-pane>
                        
                    </el-tabs>
                    
                    <div v-else>
                        <Welcome></Welcome>
                    </div>
                    
                </SplitArea>
            </Split>
        </el-main>
        <el-footer>
            时间：{{currentDateTime}}
            <el-divider direction="vertical"></el-divider>
            当前编辑：{{currentTab ? currentTab.data.name : ""}}  
            <el-divider direction="vertical"></el-divider>  
            打开：{{tabs.list.length}}
            <span style="float:right;" v-if="currentTab">
                <el-button type="text" icon="el-icon-tickets" @click="onToggleDegug(currentTab.data.id)"></el-button>
            </span>
        </el-footer>
  </el-container>
</template>

<script>
import _ from 'lodash';
import FileTree from './FileTree';
import Welcome from './Welcome';
import FsEditorView from './FsEditorView';

export default {
    name: "FsView",
    props: {
        model: Object
    },
    components:{
        FileTree,
        Welcome,
        FsEditorView
    },
    data(){
        return {
            tabs: {
                list: [],
                activeIndex: null
            },
            tree: {
                data: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            },
            control: {
                save: {
                    show: false
                }
            },
            tip: {
                loading: false,
                message: ""
            },
            editor: {
                theme: {
                    value: "merbivore",
                    list: this.m3.EDITOR_THEME
                }
            }
        }
    },
    computed:{
        currentDateTime: function(){ 
            return this.moment().format(window.global.register.format);
        },
        currentTab(){

            if ( _.isEmpty(this.tabs.list) ){
                return null;
            } else {
                let tab = _.find(this.tabs.list, (v)=>{ 
                            return v.data.id === this.tabs.activeIndex; 
                        });
                return  tab;
            }
        }
    },
    methods:{
        onNewDir(){
            this.$refs.fsTree.onNewDir(null);
        },
        onNewFile(){
            this.$refs.fsTree.onNewFile(null);
        },
        onReload(){
            this.$refs.fsTree.initData();
        },
        onTabOpen(data){
            
            try {
                let id = data.id;
                // 已经打开
                let find = _.find(this.tabs.list,(v)=>{
                    return v.data.id == id;
                });
                if(find){
                    this.tabs.activeIndex = id;
                    return false;
                }
                
                // 添加tab
                this.tabs.activeIndex = id;
                
                this.m3.dfsRead(data).then(rtn=>{
                    this.tabs.list.push({data: data, content: rtn});
                }).catch(err=>{
                    console.error(err)
                })

            } catch(err){
                console.error(11,err);
            }
        },
        onTabClose(targetName){
            
            let tabs = this.tabs.list;
            let activeIndex = this.tabs.activeIndex;
            if (activeIndex === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.data.id === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeIndex = nextTab.data.id;
                        }
                    }
                });
            }
            
            this.tabs.activeIndex = activeIndex;
            this.tabs.list = tabs.filter(tab => tab.data.id !== targetName);
             
            
        },
        onInitTreeData(){

        },
        onToggleRunningView(){

        },
        onToggleFullScreen(){
            this.m3.fullScreen(true);
        },
        onEditorChange(content){
            let fs = this.currentTab;
            fs.content = content;
        },
        onSave(){
            this.tip.loading = true;
            this.tip.message = "保存中...";
            
            let fs = _.find(this.tabs.list, (v)=>{
                return v.data.id == this.tabs.activeIndex;
            });
            
            if(_.isEmpty(fs.content)){
                this.tip.loading = false;
                this.tip.message = "";
                return false;
            }

            let param = {
                parent: fs.data.parent, name: fs.data.name, 
                data: { content: fs.content, ftype: fs.data.ftype, attr: fs.data.attr, index: true }    
            };

            // save
            this.m3.dfsWrite(param).then( ()=>{

                // this.$refs.editor.session.getUndoManager().markClean();

                this.tip.loading = false;
                this.tip.message = "";
            } ).catch((err)=>{
                this.$message.error("请确认脚本 " + err);
                this.tip.loading = false;
                this.tip.message = "";
                return false;
            });
        },
        onPlay(){
            this.tip.loading = true;
            this.tip.message = "执行中...";

            let fs = this.currentTab.data;

            let term = encodeURIComponent();
            let param = {fullname:fs.fullname, term: term };
            this.m3.dfsExec(param).then(res=>{
                this.tip.loading = false;
                this.tip.message = "";
                _.extend(fs, {output:res});
            }).catch(err=>{
                _.extend(fs, {output:err});
                this.tip.loading = false;
                this.tip.message = "";
            })
        },
        onFormatContent(){
            let fs = this.currentTab;
            let content = fs.content;
            let ftype = fs.data.ftype;
            let formatted = "";
            
            if(ftype==='html'){
                formatted = this.m3.htmlFormat(content, 4, ' ', 200);
            } else if(ftype==='js'){
                formatted = this.m3.jsFormat(content, 4, ' ', 0);
            } else if(ftype==='json'){
                formatted = JSON.stringify(JSON.parse(content),null,2);
            } else { 
                return false;
            }

            fs.content = formatted;
        },
        onToggleDegug(id){
            this.$refs[`FsEditView-${id}`][0].debug.show = !this.$refs[`FsEditView-${id}`][0].debug.show
        },
        onToggleTheme(val){
            let id = this.currentTab.data.id;
            this.$refs[`FsEditView-${id}`][0].editor.theme.value = val;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .el-container{
        height: calc(100vh - 109px);
        background: #f2f2f2;
    }

    .el-header{
        background-color:#f2f2f2;
        border-bottom:1px solid #ddd;
        height:35px!important;
        line-height:35px;
        padding:0 10px;
    }

    .el-main{
        overflow: hidden;
    }

    .el-footer{
      height:30px!important;
      line-height: 30px;
      color:#888888;
  }

  .el-tabs--border-card {
        border: unset;
        box-shadow: unset;
    }

    .el-tabs--border-card>.el-tabs__header{
        border-top:unset;
    }
</style>

<style>
    .fs-tabs .el-tabs__content{
        padding: 0px!important;
    }
</style>