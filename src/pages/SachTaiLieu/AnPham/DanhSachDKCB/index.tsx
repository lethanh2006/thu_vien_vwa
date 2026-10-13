import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { ETrangThaiDangKyCaBiet, nameTrangThaiDangKyCaBiet } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import _ from 'lodash';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import ModalThemDKCB from '../../DangKyCaBiet/components/ModalThemDKCB';
import StatDanhSachDKCB from '../../DangKyCaBiet/components/Stat';
import ThaoTacDKCB, { XoaNhieuDKCB } from '../../DangKyCaBiet/components/ThaoTac';

const DanhSachDKCB = (props: { getDataAnPham?: () => void }) => {
	const intl = useIntl();
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit, thongKeDangKyCaBietModel } = useModel('sachtailieu.anpham.anphamxepgia');
	const [trangThai, setTrangThai] = useState<string>('ALL');
	const [visibleThemDKCB, setVisibleThemDKCB] = useState<boolean>(false);

	const getData = () => {
		if (recAnPham?._id) {
			if (trangThai === 'ALL') getModel({ anPhamId: recAnPham?._id });
			else getModel({ anPhamId: recAnPham?._id, trangThai: trangThai as any });
		}
	};

	/** Tải lại thống kê ĐKCB và danh sách ấn phẩm (cột ĐKCB, giá tiền) sau khi thêm, xóa ĐKCB */
	const getThongKe = () => {
		thongKeDangKyCaBietModel({ anPhamId: recAnPham?._id });
		props.getDataAnPham?.();
	};

	const columns: IColumn<AnPham.IAnPhamXepGia>[] = [
		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb.nhanDe' }),
			width: 180,
			render: (val, rec) => <ExpandText>{recAnPham?.nhanDe}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb.tacGia' }),
			width: 150,
			render: (val, rec) => recAnPham?.tacGia,
		},

		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb.soDangKyCaBiet' }),
			dataIndex: 'soDangKyCaBiet',
			align: 'center',
			width: 120,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.dkcb.donGia' }),
			width: 120,
			align: 'right',
			// Chưa có đơn giá (ĐKCB thêm tay không gắn dòng xếp giá, dòng xếp giá chưa nhập giá) thì để trống
			render: (val, rec) => {
				const donGia = rec?.thongTinXepGia?.donGia;
				return _.isNil(donGia) ? null : `${inputFormat(donGia)} VNĐ`;
			},
		},
		{
			title: intl.formatMessage({ id: 'sachtailieu.table.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => <ThaoTacDKCB record={rec} getData={getData} getThongKe={getThongKe} />,
		},
	];

	return (
		<>
			<StatDanhSachDKCB
				condition={{
					anPhamId: recAnPham?._id,
				}}
			/>

			<Tabs activeKey={trangThai} onChange={(tab) => setTrangThai(tab)}>
				<Tabs.TabPane key='ALL' tab={intl.formatMessage({ id: 'sachtailieu.dkcb.tatCa' })} />
				{Object.values(ETrangThaiDangKyCaBiet).map((tab) => (
					<Tabs.TabPane key={tab} tab={nameTrangThaiDangKyCaBiet[tab]} />
				))}
			</Tabs>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recAnPham?._id, trangThai]}
				modelName='sachtailieu.anpham.anphamxepgia'
				buttons={{ create: false }}
				rowSelection
				otherButtons={[
					<ButtonExtend
						key={'1'}
						onClick={() => setVisibleThemDKCB(true)}
						icon={<PlusCircleOutlined />}
						notHideText
						tooltip={intl.formatMessage({ id: 'sachtailieu.dkcb.themTayDKCB' })}
					>
						{intl.formatMessage({ id: 'sachtailieu.dkcb.themTayDKCB' })}
					</ButtonExtend>,
					<XoaNhieuDKCB key={'2'} getData={getData} getThongKe={getThongKe} />,
				]}
				hideCard
			/>

			<ModalThemDKCB
				visible={visibleThemDKCB}
				setVisible={setVisibleThemDKCB}
				anPham={recAnPham}
				getData={getData}
				getThongKe={getThongKe}
			/>
		</>
	);
};

export default DanhSachDKCB;
