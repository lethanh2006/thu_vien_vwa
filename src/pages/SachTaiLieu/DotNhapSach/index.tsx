import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectHocKy from '@/pages/DaoTao/HocKy/SelectHocKy';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons';
import { Popconfirm, Space } from 'antd';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ModalExportDangKyTongQuat from './components/ModalExport';

const DotNhapSachPage = () => {
	const intl = useIntl();
	const { danhSach: danhSachHocKy, record: recHocKy, setRecord: setRecHocKy } = useModel('daotao.hocky');
	const { getModel, page, limit, handleEdit, deleteModel } = useModel('sachtailieu.anpham.dotnhapsach');
	const [visibleThongKe, setVisibleThongKe] = useState(false);

	const getData = () => {
		getModel({ maHocKy: recHocKy?.ma });
	};

	const columns: IColumn<AnPham.IDotNhapSach>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.hocky.hocKy' }),
			dataIndex: 'maHocKy',
			width: 150,
			render: (val, rec) => rec?.hocKy?.ten ?? danhSachHocKy?.find((item) => item?.ma === val)?.ten,
			hide: !!recHocKy?._id,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dotnhapsach.tenDot' }),
			dataIndex: 'ten',
			width: 160,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dotnhapsach.nguonBoSung' }),
			dataIndex: 'nguonBoSungId',
			width: 120,
			render: (val, rec) => rec?.nguonXuatNhap?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNguonBoSung multiple />,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dotnhapsach.thoiGianBatDau' }),
			dataIndex: 'thoiGianBatDau',
			width: 100,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dotnhapsach.thoiGianKetThuc' }),
			dataIndex: 'thoiGianKetThuc',
			width: 100,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dotnhapsach.soChungTu' }),
			dataIndex: 'soChungTu',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dotnhapsach.ngayChungTu' }),
			dataIndex: 'ngayChungTu',
			width: 100,
			align: 'center',
			render: (val) => val && dayjs(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dotnhapsach.moTa' }),
			dataIndex: 'moTa',
			width: 200,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'global.button.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec._id, getData)}
						title={intl.formatMessage({ id: 'sachtailieu.confirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			formProps={{ getData }}
			columns={columns}
			dependencies={[page, limit, recHocKy?.ma]}
			modelName='sachtailieu.anpham.dotnhapsach'
			title={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.title' })}
			Form={Form}
			widthDrawer={800}
		>
			<Space style={{ marginBottom: 12 }}>
				<SelectHocKy
					isSetRecord
					condition={{ active: true }}
					style={{ width: 250 }}
					value={recHocKy?.ma}
					onChange={(val) => setRecHocKy(danhSachHocKy?.find((item) => item?.ma === val))}
					selectMa
					allowClear
				/>
				<ButtonExtend onClick={() => setVisibleThongKe(true)} icon={<ExportOutlined />}>
					{intl.formatMessage({ id: 'sachtailieu.dotnhapsach.tongHopThongTinChung' })}
				</ButtonExtend>
			</Space>

			<ModalExportDangKyTongQuat visible={visibleThongKe} setVisible={setVisibleThongKe} />
		</TableBase>
	);
};

export default DotNhapSachPage;
