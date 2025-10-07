import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type EThuTrongTuan, mapNameThuTrongTuan } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import FormCauHinhVaoRaThuVien from './components/Form';

const CauHinhVaoRaThuVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { getAllModel, loading } = useModel('quanlythuvien.vaorathuvien');
	const { visibleForm, setVisibleForm, edit, setEdit, handleEdit, setRecord } = useModel('quanlythuvien.cauhinh');
	const [danhSach, setDanhSach] = useState<any>();

	const getData = () => {
		getAllModel(undefined, undefined, undefined, undefined, 'setting', false)
			.then((res: any) => setDanhSach(res))
			.catch((err) => console.log(err));
	};

	useEffect(() => {
		getData();
	}, []);

	const columns: IColumn<QuanLyThuVien.ICauHinhVaoRaThuVien>[] = [
		{
			title: 'Thời gian',
			dataIndex: 'thu',
			align: 'center',
			width: 150,
			render: (val) => mapNameThuTrongTuan[val as EThuTrongTuan],
		},
		{
			title: 'Sáng',
			width: 240,
			children: [
				{
					title: 'Thời gian vào',
					dataIndex: 'thoiGianMoCuaBuoiSang',
					align: 'center',
					width: 120,
				},
				{
					title: 'Thời gian ra',
					dataIndex: 'thoiGianDongCuaBuoiSang',
					align: 'center',
					width: 120,
				},
			],
		},
		{
			title: 'Chiều',
			width: 240,
			children: [
				{
					title: 'Thời gian vào',
					dataIndex: 'thoiGianMoCuaBuoiChieu',
					align: 'center',
					width: 120,
				},
				{
					title: 'Thời gian ra',
					dataIndex: 'thoiGianDongCuaBuoiChieu',
					align: 'center',
					width: 120,
				},
			],
		},
		{
			title: 'Tối',
			width: 240,
			children: [
				{
					title: 'Thời gian vào',
					dataIndex: 'thoiGianMoCuaBuoiToi',
					align: 'center',
					width: 120,
				},
				{
					title: 'Thời gian ra',
					dataIndex: 'thoiGianDongCuaBuoiToi',
					align: 'center',
					width: 120,
				},
			],
		},
		{
			title: 'Thao tác',
			align: 'center',
			fixed: 'right',
			width: 100,
			render: (val, rec) => (
				<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
			),
		},
	];

	return (
		<Modal
			title='Cấu hình vào ra thư viện trong tuần'
			open={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={1000}
		>
			<TableStaticData
				loading={loading}
				columns={columns}
				data={_.orderBy(danhSach?.thoiGian, ['thu'], 'asc') ?? []}
				size='small'
				addStt
				hasTotal
				otherProps={{ pagination: true }}
			>
				<ButtonExtend
					size='small'
					type='primary'
					icon={<PlusCircleFilled />}
					onClick={() => {
						setRecord({} as QuanLyThuVien.ICauHinhVaoRaThuVien);
						setEdit(false);
						setVisibleForm(true);
					}}
				>
					Thêm mới
				</ButtonExtend>
			</TableStaticData>

			<Modal
				title={`${edit ? 'Chỉnh sửa' : 'Thêm mới'} cấu hình`}
				open={visibleForm}
				onCancel={() => setVisibleForm(false)}
				footer={null}
				width={800}
			>
				<FormCauHinhVaoRaThuVien getData={getData} danhSach={danhSach} />
			</Modal>
		</Modal>
	);
};

export default CauHinhVaoRaThuVien;
