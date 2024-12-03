import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useModel } from 'umi';
import Form from './Form';

const FormItemTruongCon = (props: {
	value?: TruongBienMuc.TDanhSachTruongCon[];
	onChange?: (data: TruongBienMuc.TDanhSachTruongCon[]) => void;
	disabled?: boolean;
}) => {
	const { handleEdit, setVisibleForm, visibleForm, setEdit, edit, record, setRecord, isView, setIsView, handleView } =
		useModel('danhmuc.truongcon');
	const { value = [], onChange, disabled } = props;

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: TruongBienMuc.TDanhSachTruongCon) => {
		if (!record?.index) {
			const data = [...value, rec];
			if (onChange) onChange(data);
			setVisibleForm(false);
		} else {
			const data = [...value];
			data.splice(record?.index - 1, 1, rec);
			if (onChange) onChange(data);
			setVisibleForm(false);
		}
	};

	const onCell = (rec: TruongBienMuc.TDanhSachTruongCon) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<TruongBienMuc.TDanhSachTruongCon>[] = [
		{
			title: 'Tag code',
			dataIndex: 'tagCode',
			width: 100,
			onCell,
		},
		{
			title: 'Code',
			dataIndex: 'code',
			width: 180,
			onCell,
		},
		{
			title: 'Tiêu đề',
			dataIndex: 'tieuDe',
			width: 200,
			render: (val) => <ExpandText>{val}</ExpandText>,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' type='link' onClick={() => handleEdit(rec)} icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => onDelete(rec.index - 1)}
						title='Bạn có chắc chắn muốn xóa thông tin này?'
						placement='topLeft'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
			hide: disabled,
		},
	];

	return (
		<>
			<TableStaticData
				data={value}
				columns={columns}
				size='small'
				hasTotal
				addStt
				otherProps={{ pagination: false, scroll: { y: 400 } }}
			>
				<Button
					disabled={disabled}
					icon={<PlusCircleOutlined />}
					onClick={() => {
						setRecord({} as TruongBienMuc.TDanhSachTruongCon);
						setEdit(false);
						setIsView(false);
						setVisibleForm(true);
					}}
					size='small'
					type='primary'
				>
					Thêm mới
				</Button>
			</TableStaticData>

			<Modal
				title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} trường con`}
				visible={visibleForm}
				width={600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				<Form onOk={onAdd} />
			</Modal>
		</>
	);
};

export default FormItemTruongCon;
