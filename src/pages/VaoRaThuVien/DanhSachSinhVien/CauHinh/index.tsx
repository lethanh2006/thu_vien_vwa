import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { type EThuTrongTuan, mapNameThuTrongTuan } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { EditOutlined, PlusCircleFilled } from '@ant-design/icons';
import { Modal } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import FormCauHinhVaoRaThuVien from './components/Form';

const CauHinhVaoRaThuVien = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const { visible, setVisible } = props;
	const { getAllModel, loading } = useModel('quanlythuvien.vaorathuvien');
	const { visibleForm, setVisibleForm, edit, setEdit, handleEdit, setRecord } = useModel('quanlythuvien.cauhinh');
	const [danhSach, setDanhSach] = useState<any>();
	const intl = useIntl();

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
			title: intl.formatMessage({ id: 'vaorathuvien.table.column.thoiGian' }),
			dataIndex: 'thu',
			align: 'center',
			width: 150,
			render: (val) => mapNameThuTrongTuan[val as EThuTrongTuan],
		},
		{
			title: intl.formatMessage({ id: 'vaorathuvien.table.column.sang' }),
			width: 240,
			children: [
				{
					title: intl.formatMessage({ id: 'vaorathuvien.table.column.thoiGianVao' }),
					dataIndex: 'thoiGianMoCuaBuoiSang',
					align: 'center',
					width: 120,
				},
				{
					title: intl.formatMessage({ id: 'vaorathuvien.table.column.thoiGianRa' }),
					dataIndex: 'thoiGianDongCuaBuoiSang',
					align: 'center',
					width: 120,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'vaorathuvien.table.column.chieu' }),
			width: 240,
			children: [
				{
					title: intl.formatMessage({ id: 'vaorathuvien.table.column.thoiGianVao' }),
					dataIndex: 'thoiGianMoCuaBuoiChieu',
					align: 'center',
					width: 120,
				},
				{
					title: intl.formatMessage({ id: 'vaorathuvien.table.column.thoiGianRa' }),
					dataIndex: 'thoiGianDongCuaBuoiChieu',
					align: 'center',
					width: 120,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'vaorathuvien.table.column.toi' }),
			width: 240,
			children: [
				{
					title: intl.formatMessage({ id: 'vaorathuvien.table.column.thoiGianVao' }),
					dataIndex: 'thoiGianMoCuaBuoiToi',
					align: 'center',
					width: 120,
				},
				{
					title: intl.formatMessage({ id: 'vaorathuvien.table.column.thoiGianRa' }),
					dataIndex: 'thoiGianDongCuaBuoiToi',
					align: 'center',
					width: 120,
				},
			],
		},
		{
			title: intl.formatMessage({ id: 'vaorathuvien.table.column.thaoTac' }),
			align: 'center',
			fixed: 'right',
			width: 100,
			render: (val, rec) => (
				<ButtonExtend
					tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
					onClick={() => handleEdit(rec)}
					type='link'
					icon={<EditOutlined />}
				/>
			),
		},
	];

	return (
		<Modal
			title={intl.formatMessage({ id: 'vaorathuvien.card.title.cauHinhVaoRaThuVienTrongTuan' })}
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
					{intl.formatMessage({ id: 'global.button.themmoi' })}
				</ButtonExtend>
			</TableStaticData>

			<Modal
				title={
					`${edit ? intl.formatMessage({ id: 'global.button.chinhsua' }) : intl.formatMessage({ id: 'global.button.themmoi' })}` +
					' ' +
					intl.formatMessage({ id: 'vaorathuvien.label.cauhinh' })
				}
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
