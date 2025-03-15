import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm } from 'antd';
import { useModel } from 'umi';
import Form from './Form';
import BoxFile from '@/components/BoxFile';
import PreviewFile from '@/components/PreviewFile';

const FormItemTaiLieuSo = (props: {
	value?: AnPham.TDanhSachTaiLieuTrucTuyen[];
	onChange?: (data: AnPham.TDanhSachTaiLieuTrucTuyen[]) => void;
	disabled?: boolean;
}) => {
	const { handleEdit, setVisibleForm, visibleForm, setEdit, edit, record, setRecord, isView, setIsView, handleView } =
		useModel('sachtailieu.anpham.danhsachtailieu');
	const { value = [], onChange, disabled } = props;

	const onDelete = (index: number) => {
		const data = [...value];
		data.splice(index, 1);
		if (onChange) onChange(data);
	};

	const onAdd = (rec: AnPham.TDanhSachTaiLieuTrucTuyen) => {
		const data = Array.isArray(value) ? [...value] : [];

		if (!record?.index) {
			data.push(rec);
		} else {
			data.splice(record.index - 1, 1, rec);
		}

		console.log(data);

		if (onChange) onChange(data);
		setVisibleForm(false);
	};

	const onCell = (rec: AnPham.TDanhSachTaiLieuTrucTuyen) => ({
		onClick: () => handleView(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<AnPham.TDanhSachTaiLieuTrucTuyen>[] = [
		{
			title: 'Tên tài liệu',
			dataIndex: 'ten',
			width: 150,
			onCell,
		},
		{
			title: 'File tài liệu',
			dataIndex: 'url',
			width: 120,
			render: (val) => <BoxFile url={val} />,
			onCell,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 220,
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
				{disabled ? null : (
					<Button
						icon={<PlusCircleOutlined />}
						onClick={() => {
							setRecord({} as AnPham.TDanhSachTaiLieuTrucTuyen);
							setEdit(false);
							setIsView(false);
							setVisibleForm(true);
						}}
						size='small'
						type='primary'
					>
						Thêm mới
					</Button>
				)}
			</TableStaticData>

			<Modal
				title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} hồ sơ lưu`}
				visible={visibleForm}
				width={isView ? 1000 : 600}
				footer={null}
				onCancel={() => setVisibleForm(false)}
			>
				{isView ? <PreviewFile file={record?.url ?? ''} /> : <Form onOk={onAdd} />}
			</Modal>
		</>
	);
};

export default FormItemTaiLieuSo;
