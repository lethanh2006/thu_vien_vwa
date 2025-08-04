import MyDatePicker from '@/components/MyDatePicker';
import TableBase from '@/components/Table';
import { type IColumn } from '@/components/Table/typing';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import { colorTrangThaiGhiNhanAnPhamDinhKy, ETrangThaiGhiNhanAnPhamDinhKy } from '@/services/AnPhamDinhKy/constant';
import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import { tienVietNam } from '@/utils/utils';
import { Button, Modal, Select, Space, Tag } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';

const ModalChiTietGhiNhanAnPham = (props: { visible: boolean; setVisible: (val: boolean) => void }) => {
	const intl = useIntl();
	const { visible, setVisible } = props;
	const { record: recAnPhamDinhKy } = useModel('anphamdinhky.anphamdinhky');
	const { page, limit, getModel } = useModel('anphamdinhky.ghinhan');
	const [monthSelect, setMonthSelect] = useState(moment().month());
	const [yearSelect, setYearSelect] = useState(moment().year());

	const getData = () => {
		if (recAnPhamDinhKy?._id) {
			getModel(undefined, undefined, undefined, undefined, undefined, `chi-tiet/${recAnPhamDinhKy?._id}`, {
				thang: monthSelect,
				nam: yearSelect,
			});
		}
	};

	const columns: IColumn<AnPhamDinhKy.GhiNhanAnPhamDinhKy>[] = [
		{
			title: 'Kho',
			dataIndex: 'khoSachId',
			width: 120,
			render: (val, rec) => rec?.khoSach?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoSach multiple />,
		},
		{
			title: 'Số ấn phẩm định kỳ',
			dataIndex: 'soAnPhamDinhKy',
			width: 130,
			filterType: 'string',
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Đơn giá',
			dataIndex: 'donGia',
			width: 130,
			render: (val, rec) => tienVietNam(val),
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Ngày nhận',
			dataIndex: 'ngayGhiNhan',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiGhiNhan',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={colorTrangThaiGhiNhanAnPhamDinhKy[val as ETrangThaiGhiNhanAnPhamDinhKy]}>{val}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiGhiNhanAnPhamDinhKy),
			fixed: 'right',
		},
	];

	return (
		<Modal
			title='Chi tiết ghi nhận ấn phẩm định kỳ'
			visible={visible}
			onCancel={() => setVisible(false)}
			footer={null}
			width={1000}
		>
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recAnPhamDinhKy?._id, monthSelect, yearSelect]}
				modelName='anphamdinhky.ghinhan'
				title='Danh sách ghi nhận ấn phẩm định kỳ'
				buttons={{ create: false }}
				hideCard
				otherButtons={[
					<Space wrap key={'1'}>
						<Select
							placeholder='Chọn tháng'
							style={{ width: 120 }}
							value={monthSelect}
							options={_.range(1, 13).map((item) => ({
								key: item,
								value: item,
								label: `Tháng ${item}`,
							}))}
							onChange={(val) => {
								setMonthSelect(val);
							}}
							allowClear
						/>

						<MyDatePicker
							style={{ width: 120 }}
							value={yearSelect ? moment(yearSelect, 'YYYY') : null}
							pickerStyle={'year'}
							format={'YYYY'}
							onChange={(val) => {
								setYearSelect(moment(val).year());
							}}
						/>
					</Space>,
				]}
			/>

			<div className='form-footer'>
				<Button onClick={() => setVisible(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
			</div>
		</Modal>
	);
};

export default ModalChiTietGhiNhanAnPham;
