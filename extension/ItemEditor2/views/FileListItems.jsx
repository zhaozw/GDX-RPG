import React from 'react';
import {List, ListItem} from 'material-ui/List';
import AddIcon from 'material-ui/svg-icons/content/add';
import SearchIcon from 'material-ui/svg-icons/action/subject';
import IconButton from 'material-ui/IconButton';
import FileListItem from './FileListItem';
import TextField from 'material-ui/TextField';

export default class FileListItems extends React.Component {

	state = {open: false, files: [], searchValue: ""};

	constructor(props) {
		super(props);

		E.files._files.push(this);
	}

	componentWillMount() {
		this.reader = require("../scripts/FileType/" + this.props.type).default;
		this.load();
	}

	list() {
		let result = [];

		for(let i = 0; i > -1; i++){
			var id = "item" + i;
			if(this.refs[id] != undefined)
				result.push(this.refs[id])
			else
				break;
		}

		return result;
	}

	type() {
		return this.reader.type;
	}

	open(flag){
		if(flag == undefined)
			return this.state.open;
		this.setState({open: flag})
	}

	search(value){
		this.setState({searchValue: value})
	}

	load() {
		this.reader.list(filesName => {

			let files = [];

			let currentRead = -1;
			let read = () => {
				if(++currentRead >= filesName.length){
					for(let file of files){
						if(!file.post)
							break;
						file.post(files);
						this.setState({files: files});
					}
				}else{
					this.reader.read(filesName[currentRead], file => {
						files.push(file);
						this.setState({files: files});
						read();
					});
				}
			};
			read();

			const subItem = [];

			for(let file of files)
				subItem.push(<FileListItem key={j} fileName={file} type={this.props.type} search={() => this.state.searchValue}/>);

			this.setState({searchValue: ""});
		});
	}

	refresh() {
		this.setState({files: this.state.files.filter(e => !e.deleted)})
	}

	add(file) {
		this.setState({files: [...this.state.files, file]});
	}

	render() {
		let files = this.state.files;
		let filtedFiles = [];
		let searchValue = this.state.searchValue;

		for(let file of files){
			let text = (file.prefix ? ("[" + file.prefix.text + "]") : "") + file.label + "  " + file.fileName;
			let include = searchValue.length == 0 || false;

			for(let value of searchValue.split(" ")) {
				if (value.trim().length == 0)
					continue;

				include = text.toLocaleLowerCase().indexOf(value.toLocaleString()) >= 0;
				if (!include)
					break;
			}

			if(include)
				filtedFiles.push(file);
		}

		filtedFiles = filtedFiles.map((file, index) => <FileListItem ref={"item" + index} file={file} index={index} key={index}/>);

		var searching = filtedFiles.length != files.length;
		return (
			<ListItem
				ref="listItem"
				className={"list-item-head"}
				primaryText={
					<div className="list-type-head">
						{this.reader.typeName}
						<span className={searching ? "searching" : ""}>
							{searching ? filtedFiles.length + " / " : ""}
							{this.state.files.length}
						</span>
					</div>
				}
				primaryTogglesNestedList={true}
				leftIcon={
					<div className="file-list-toolbar">
						<IconButton onClick={e => e.stopPropagation()}><AddIcon/></IconButton>
					</div>
				}
				open={this.state.open}
				onClick={() => this.setState({open: !this.state.open})}
				key={1}
				nestedItems={[
					<ListItem key={-1} primaryText={
						<TextField hintText="输入名称以过滤..." className={"filter-input"} onChange={e => this.search(e.target.value)} value={this.state.searchValue}/>
					} className={"filter"} leftIcon={<SearchIcon />} />,
					...filtedFiles
				]}
			/>
		);
	}
}