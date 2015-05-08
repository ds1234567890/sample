/** @jsx React.DOM */
var socketPushService = new SocketPushService();

//�e�[�u���̃��f��
var TableSingle = React.createClass({
    propTypes: {
      id:   React.PropTypes.number.isRequired,
      schema: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired
    },
    render() {
      return (<div>[{this.props.id}]:{this.props.schema}:{this.props.name}</div>);
    }
});

//���X�g���̃R���|�[�l���g
var TableList = React.createClass({

    //�������i���X�i�[�̐ݒ�j
    initializeTables: function () {
        var socket = this.props.socketPushService;
        //��M���̃��X�i�[
        socket.bindReceiveListener(function (message) {
            if (message.messageType === 'dataCompleted') {
                //���݂͑S�u����(this.state.tables�ɍ����������삵���ق��������Ǝv���j
                this.state.tables = message.tables;
                this.setState({tables: this.state.tables});
            }
            if (message.messageType === 'error') {
            }
        }.bind(this));
    },
    //�f�[�^�ǂݍ��ݗv��
    loadTables: function () {
        var socket = this.props.socketPushService;
        //���N�G�X�g�v��
        socket.sendRequest({messageType: 'loadTables'});
    },
    //�f�[�^���M�v��
    createTables: function () {
        var socket = this.props.socketPushService;
        var ddl = React.findDOMNode(this.refs.sqlText).value.trim();
        //���N�G�X�g�v��
        socket.sendRequest({messageType: 'createTables', sqlText: ddl});
    },
    //DOM�c���[�����㏉����
    componentDidMount: function() {
        this.initializeTables();
        this.loadTables();
    },
    //�����̏��
    getInitialState() {
        return {
          tables: [ {"id": "0", "schema": "sample", "name": "sample"},{"id": "1", "schema": "sample2", "name": "sample2"},{"id": "2", "schema": "sample3", "name": "sample3"} ]
        }
    },
    render() {
      var tables = this.state.tables.map((table) => {
        return <TableSingle id={table.id} schema={table.schema} name={table.name}/>
      });
      return (
          <div class="page-list">
              <textarea name="sqlText" rows="10" cols="50" ref="sqlText"></textarea>
              <input type="button" value="create" onClick={this.createTables} />
              <h2>TableList</h2>
              {tables}
          </div>
      );
    }
});

//�w�b�_���̃R���|�[�l���g
var TableHead = React.createClass({
    render() {
      return (
          <div class="page-header">
              <h1>Sample</h1>
          </div>
      );
    }
});

//�S�̂̃R���|�[�l���g
var ALL = React.createClass({
    render() {
      return (
          <div class="page-all">
            <TableHead />
            <TableList socketPushService={this.props.socketPushService} />
          </div>
      );
    }
});

//�S�̂̕`��
React.render(
  <ALL socketPushService={socketPushService} />,
  document.getElementById('content')
);
