<template>
    <el-container style="height:100%;">
        <el-header style="height:40px;line-height:40px;padding:0px 10px;display:flex;">
            <el-input v-model="filterText" 
                placeholder="搜索" size="mini"
                clearable></el-input>
                <el-dropdown placement="top-start" trigger="click">
                    <el-tooltip content="导出、导入" >
                        <el-button type="text" icon="el-icon-menu" style="color:#333333;padding-left: 10px;"></el-button>
                    </el-tooltip>
                    <el-dropdown-menu slot="dropdown">
                        <div class="tool-box">
                            <div class="tool">
                                <div>导入</div>
                                <p>
                                    <label for="auto-file-upload">
                                        <span class="el-icon-download" style="cursor:pointer;font-size:16px;padding:10px;"></span>
                                    </label>
                                    <input id="auto-file-upload" type="file" @change="onImport" required="required" style="display:none;" />
                                </p>
                            </div>
                            <div class="tool" @click="onExport(null)">
                                <div>导出</div>
                                <p>
                                    <el-button type="text">
                                        <span class="el-icon-download" style="cursor:pointer;font-size:16px;"></span>
                                    </el-button>
                                </p>
                            </div>
                        </div>
                    </el-dropdown-menu>
                </el-dropdown>
        </el-header>
        <el-main style="padding:0px; height: 100%;">
            <el-tree :data="treeData" 
                    :props="defaultProps" 
                    node-key="fullname"
                    highlight-current
                    default-expand-all
                    auto-expand-parent
                    @node-click="onNodeClick"
                    :filter-node-method="onFilterNode"
                    :expand-on-click-node="false"
                    style="background:transparent;overflow: auto;height: 100%;"
                    ref="tree">
                <span slot-scope="{ node, data }" style="width:100%;height:30px;line-height: 30px;"  @mouseenter="onMouseEnter(data)" @mouseleave="onMouseLeave(data)">
                    <span v-if="data.ftype=='dir'">
                        <i class="el-icon-folder" style="color:#FFC107;"></i> 
                        <span> {{node.label}}</span>
                        <el-dropdown v-show="data.show" style="float:right;width:14px;padding-right:10px;">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="onDelete(data,$event)" icon="el-icon-delete" v-if="data.id!=-1">删除</el-dropdown-item>
                                <el-dropdown-item @click.native="onRefresh(data)" icon="el-icon-refresh">刷新</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewFile(data)" icon="el-icon-plus">新建文件</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewDir(data,$event)" icon="el-icon-folder-add">新建目录</el-dropdown-item>
                                <el-dropdown-item @click.native="onUpload(data,$event)" icon="el-icon-upload">上传</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </span>
                    <span v-else>
                        <i class="el-icon-c-scale-to-original" style="color:#0088cc;"></i>
                        <span> {{node.label}}</span>
                        <el-dropdown v-show="data.show" style="float:right;width:14px;padding-right:10px;">
                            <span class="el-dropdown-link">
                                <i class="el-icon-more el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native="onDelete(data,$event)" icon="el-icon-delete" v-if="data.id!=-1">删除</el-dropdown-item>
                                <el-dropdown-item @click.native="onRefresh(data)" icon="el-icon-refresh">刷新</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewFile(data)" icon="el-icon-plus">新建文件</el-dropdown-item>
                                <el-dropdown-item @click.native="onNewDir(data,$event)" icon="el-icon-folder-add">新建目录</el-dropdown-item>
                                <el-dropdown-item @click.native="onUpload(data,$event)" icon="el-icon-upload">上传</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-button v-show="data.show" type="text" @click.stop="onEdit(data)" style="float:right;width:14px;margin:0 5px;" icon="el-icon-edit-outline"></el-button>
                    </span>
                </span>  
            </el-tree>
            <el-dialog title="新建" :visible.sync="dialog.newFile.show">
                <el-form :model="dialog.newFile.data" :rules="dialog.newFile.rules" label-position="top">
                    <el-form-item label="名称">
                        <el-input v-model="dialog.newFile.data.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="dialog.newFile.data.ftype" placeholder="请选择类型">
                            <el-option label="Javascript" value="js"></el-option>
                            <el-option label="Json" value="json"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialog.newFile.show = false">取 消</el-button>
                    <el-button type="primary" @click="onSaveNewFile">确 定</el-button>
                </div>
            </el-dialog>
        </el-main>
    </el-container>
</template>

<script>
import _ from 'lodash';

export default {
    name: "FileView",
    props: {
        model: Object
    },
    data(){
        return {
            root: '/app/matrix',
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            treeData: [],
            filterText: "",
            dialog:{
                newFile:{
                    show: false,
                    data: {
                      name: "",
                      ftype: "js"
                    },
                    rules: {
                        name: [
                            { required: true, message: '请输入名称', trigger: 'blur' }
                        ],
                        ftype: [
                            { required: true, message: '请选择类型', trigger: 'change' }
                        ]
                    }
                }
            },
            whiteList: ['diagnosis','contextmenu','severity','attachment','event_list.js','job','notify','policy','view']
        }
    },
    watch: {
        filterText(val) {
            if(_.isEmpty(val)){
                this.onInit();
            } else {
                this.$refs.tree.filter(val);
            }
        }
    },
    created(){
        this.initData();
    },
    methods: {
        initData(){
            let param = {parent: this.root, fullname: this.root };
            this.m3.dfsList(param).then( (rtn)=>{
                this.treeData = [{ id:-1,fullname: this.root, parent: this.root, name:'我的应用',children: _.sortBy(rtn.message, ['fullname'],['asc']), ftype:'dir'}];
            } );
        },
        onMouseEnter(item){
            this.$set(item, 'show', true)
            this.$refs.tree.setCurrentKey(item.key);
        },
        onMouseLeave(item){
            this.$set(item, 'show', false)
        },
        onRefresh(item){
            this.initData();
            /* this.m3.dfsList(item).then( (rtn)=>{
                this.$set(item, 'children', _.sortBy(rtn.message, ['fullname'],['asc']));
            } ); */
        },
        onNewDir(data){
            
            let item = null;
            
            if(!data){
                item = { fullname: this.root};
            } else {
                item = data;
            }


            this.$prompt('请输入应用名称', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
              }).then(({ value }) => {
                if(_.isEmpty(value)){
                    this.$message({
                        type: 'warning',
                        message: '请输入应用名称！'
                    });
                    return false;
                }

                let parent = item.fullname;

                if(item.id == -1){
                    parent = this.root;
                }
    
                let param = {
                                parent:parent, name: value,
                                data:{content:null,ftype:'dir',attr:{remark: '', rate: 0}}
                };
                this.m3.dfsNew(param).then( (res)=>{
                    this.$message({
                        type: "success",
                        message: "新建应用成功 " + res
                    })

                    this.onRefresh(item);
                    
                }).catch(err=>{
                    this.$message({
                        type: "error",
                        message: "新建应用失败，" + err.message
                    })
                });
                
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: '取消新建应用操作'
                });       
              });
            
        },
        onNewFile(data){
            this.dialog.newFile.show = true;
            this.dialog.newFile.data = _.extend({},data,this.dialog.newFile.data);
        },
        onSaveNewFile(){
            let item = this.dialog.newFile.data;
            
            if(_.isEmpty(item.name)){
                this.$message({
                    type: 'warning',
                    message: '请输入名称！'
                });
                return false;
            }

            let parent = item.fullname;

            if(item.id == -1){
                parent = this.root;
            }
            
            let param = {
                            parent:parent, name: [item.name,item.ftype].join("."),
                            data:{content:'',ftype: item.ftype, attr:{remark: '', rate: 0}}
            };
            this.m3.dfsNew(param).then( (res)=>{
                this.$message({
                    type: "success",
                    message: "新建成功 " + res
                })

                this.onRefresh(item);

                this.dialog.newFile.show = false;
                
            }).catch(err=>{
                this.$message({
                    type: "error",
                    message: "新建失败，" + err.message
                })
                this.dialog.newFile.show = false;
            });
            
        },
        onDelete(item){

            if(_.includes(this.whiteList,item.name)){
                this.$message.warning("系统目录，不能删除")
                return false;
            }
            
            this.$confirm(`确认要删除该目录或文件：${item.name}？`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = {parent:item.parent, name:item.name};
                this.m3.dfsDelete(param).then( res=>{
                    this.$message({
                            type: "success",
                            message: "删除成功 " + item.name
                    })
                    
                    this.onRefresh(item);
                    
                }).catch(err=>{
                    this.$message({
                        type: "error",
                        message: "删除失败 " + err.message
                    })
                });

            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "取消删除操作"
                })
            });
        },
        onUpload(){

            /* let wnd = null;
            let wndID = `jsPanel-upload-${objectHash.sha1(item.id)}`;

            try{
                if(jsPanel.activePanels.getPanel(wndID)){
                    jsPanel.activePanels.getPanel(wndID).close();
                }
            } catch(error){

            }
            finally{
                wnd = maxWindow.winUpload('文件上传', `<div id="${wndID}"></div>`, null, null);
            }
            
            new Vue({
                delimiters: ['#{', '}#'],
                template:   `<el-container>
                                <el-main>
                                    <el-upload drag
                                        multiple
                                        show-file-list="false"
                                        :action="upload.url"
                                        :on-success="onSuccess"
                                        :on-remove="onRemove"
                                        list-type="text"
                                        name="uploadfile">
                                        <i class="el-icon-upload"></i>
                                    </el-upload>
                                </el-main>
                                <el-footer>
                                    <i class="fas fa-clock"></i> 上传文件：#{upload.fileList.length}# 
                                </el-footer>
                            </el-container>`,
                data: {
                    upload: {
                        url: `/fs/${item.fullname}?issys=true`,
                        fileList: []
                    }
                },
                created(){
                    
                },
                methods: {
                    beforeUpload(file){
                        
                    },
                    onSuccess(res,file,FileList){
                        this.upload.fileList = FileList;
                    },
                    onRemove(file) {
                        fsHandler.fsDeleteAsync(item.fullname,file.name).then( (rtn)=>{

                        } );
                    },
                    onPreview(file) {
                        console.log(file);
                    }
                }
            }).$mount(`#${wndID}`); */
            
        },  
        onFilterNode:_.debounce(function(value) {
            const self = this;

            if (!value) return true;

            try{
                this.m3.callFS("/matrix/fs/getFsByTerm.js", encodeURIComponent(value)).then( (rtn)=>{
                    self.treeData = rtn.message;
                } );
            } catch(err){
                self.treeData = [];
            }
        },1000),
        onNodeClick(data){
            
            try{

                if(data.isdir) {
                    let param = {parent: data.fullname, fullname: data.fullname };
                    this.m3.dfsList(param).then( (rtn)=>{
                        let children = _.sortBy(rtn.message,'fullname');
                        this.$set(data, 'children', children);
                    } )
                }

            } catch(err){
                console.error(err);
            }

        },
        onEdit(data){
            this.$emit("node-click",data);
        },
        onExport(data){
            let key = "";
    
            if(_.isNull(data)){
                key = this.root;
            }else {
                key = data.key;
            }

            this.$confirm(`确认要导出 ${key} 下的接口?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                
                this.m3.dfsExport(key).then(res=>{
                    this.$message.success("接口导出成功 " + res);
                }).catch(err=>{
                    this.$message.error("接口导出失败 " + err);
                });
                
            }).catch(() => {
                this.$message({
                    type: "info",
                    message: "已取消导出操作"
                })
            });
        },
        onImport(event){
            
            let file = event.target.files[0];
            const h = this.$createElement;

            this.$msgbox({
                    title: `确认要导入接口文件`, 
                    message: h('span', null, [
                        h('p', null, `文件名称：${file.name}`),
                        h('p', null, `修改时间：${file.lastModifiedDate}`),
                        h('p', null, `文件大小：${this.m3.bytesToSize(file.size)}`)
                    ]),
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    customClass:'api-messagebox',
                    type: 'warning'
            }).then(() => {

                this.m3.dfsImport(file).then(res=>{
                    this.$message({
                        type: "success",
                        message: "导入成功 " + res.name
                    })

                    this.initData();

                    event.target.value = '';

                }).catch(err=>{
                    this.$message({
                        type: "error",
                        message: "导入失败 " + err
                    })

                    event.target.value = '';
                });

            }).catch(() => {
                
                this.$message({
                    type: "info",
                    message: "已取消导入操作"
                })

                event.target.value = '';
            }); 
            
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .el-container{
    height: calc(100vh - 220px);
  }

  .el-main{
    overflow: hidden;
  }

  .tool-box{
        display:flex;
        flex-wrap: wrap;
        align-items:flex-start;
        padding:20px;
        width: auto;
    }
    .tool-box .tool{
        text-align:center;
        padding:20px;
        margin:5px;
        border:1px solid #efefef;
        height: 60px;
        width: 65px;
        border-radius: 5px;
    }
    .tool-box .tool:hover{
        cursor: pointer;
        background: rgba(125, 202, 253,.2);
    }
</style>

<style>

    #pane-fsView .el-dialog {
        width: 40vw!important;
        height: 50vh;
    }

    .api-messagebox.el-message-box{
        width:40vw!important;
    }
    .api-messagebox .el-message-box__message p {
        line-height: 43px;
    }
</style>
