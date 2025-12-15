import TableStaticData from '@/components/Table/TableStaticData';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn, TFilter } from '@/components/Table/typing';
import type { KhoaNganh } from '@/services/DaoTao/KhoaNganh/typings';
import { Col, Form, Row } from 'antd';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import SelectHinhThuc from '../HinhThuc/Select';
import SelectKhoaSinhVien from '../KhoaSinhVien/Select';
import SelectNganhCoSo from '../Nganh/Select';
import SelectTrinhDo from '../TrinhDo/Select';

/** Form Item chọn khóa ngành theo Trình độ, hình thức, khóa, ngành */
const FormItemKhoaNganh = (props: {
	value?: string[] | null;
	onChange?: (val: string[] | null) => void;
	khoaNganhCondition?: Partial<KhoaNganh.IRecord>;
}) => {
	const { record: recTrinhDo, setRecord: setTrinhDo, danhSach: danhSachTrinhDo } = useModel('daotao.trinhdo');
	const { record: recHinhThuc, setRecord: setHinhThuc, danhSach: danhSachHinhThuc } = useModel('daotao.hinhthucdaotao');
	const { danhSach: danhSachKhoa } = useModel('daotao.khoasinhvien');
	const { danhSach: danhSachNganh } = useModel('daotao.nganhdaotao');
	const { getAllModel, danhSach, loading, setDanhSach } = useModel('daotao.khoanganh');
	const [maKhoaList, setMaKhoaList] = useState<string[] | undefined>();
	const [maNganhList, setMaNganhList] = useState<string[] | undefined>();
	const { value, onChange, khoaNganhCondition } = props;

	useEffect(() => {
		if (!maKhoaList?.length && !maNganhList?.length) {
			setDanhSach([]);
			if (onChange && value?.length) onChange([]);
			return;
		}
		const filter: TFilter<KhoaNganh.IRecord>[] = [];
		if (maKhoaList?.length)
			filter.push({ field: 'maKhoaSinhVien', values: maKhoaList, operator: EOperatorType.INCLUDE });

		if (maNganhList?.length) filter.push({ field: 'maNganh', values: maNganhList, operator: EOperatorType.INCLUDE });

		getAllModel(
			undefined,
			undefined,
			!maKhoaList?.length
				? { maTrinhDo: recTrinhDo?.ma, maHinhThuc: recHinhThuc?.ma, ...(khoaNganhCondition ?? {}) }
				: khoaNganhCondition,
			filter,
		).then((res) => {
			if (onChange && (maKhoaList || maNganhList)) onChange(res.map((item) => item.ma));
		});
	}, [JSON.stringify(maKhoaList), JSON.stringify(maNganhList), danhSachKhoa.length, danhSachNganh.length]);

	const columns: IColumn<KhoaNganh.IRecord>[] = [
		// {
		// 	title: 'Mã khóa ngành',
		// 	dataIndex: 'ma',
		// 	width: 120,
		// },
		{
			title: 'Khóa sinh viên',
			dataIndex: 'maKhoaSinhVien',
			width: 100,
			render: (val, rec) => rec.khoaSinhVien.ten ?? val,
		},
		{
			title: 'Ngành đào tạo',
			dataIndex: 'maNganh',
			width: 180,
			render: (val, rec) => rec?.nganh?.ten ?? val,
		},
		{
			title: 'Mã ngành',
			dataIndex: 'maNganh',
			width: 100,
		},
		{
			title: 'CSĐT',
			dataIndex: 'maCSDT',
			filterType: 'string',
			width: 80,
		},
		{
			title: 'Tính chất',
			dataIndex: 'maTinhChatCt',
			filterType: 'string',
			width: 80,
		},
	];

	const onChangeTrinhDo = (maTrinhDo: string) => {
		const trinhDo = danhSachTrinhDo.find((item) => item.ma === maTrinhDo);
		setTrinhDo(trinhDo);
		setMaKhoaList([]);
		setMaNganhList([]);
	};

	const onChangeHinhThuc = (maHinhThuc: string) => {
		const hinhThuc = danhSachHinhThuc.find((item) => item.ma === maHinhThuc);
		setHinhThuc(hinhThuc);
		setMaKhoaList([]);
		setMaNganhList([]);
	};

	return (
		<Row gutter={[12, 0]}>
			<Col span={24} md={6}>
				<Form.Item label='Trình độ'>
					<SelectTrinhDo
						// allowClear
						value={recTrinhDo?.ma}
						onChange={(val) => onChangeTrinhDo(val as string)}
						selectMa
						hasDefault
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={6}>
				<Form.Item label='Hình thức'>
					<SelectHinhThuc
						// allowClear
						value={recHinhThuc?.ma}
						onChange={(val) => onChangeHinhThuc(val as string)}
						selectMa
						hasDefault
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={6}>
				<Form.Item label='Khóa sinh viên'>
					<SelectKhoaSinhVien
						condition={{ maTrinhDoDaoTao: recTrinhDo?.ma, maHinhThucDaoTao: recHinhThuc?.ma }}
						onChange={(val) =>
							setMaKhoaList(
								Array.isArray(val)
									? danhSachKhoa.filter((item) => val.includes(item.ma)).map((item) => item.ma)
									: undefined,
							)
						}
						allowClear
						selectMa
						multiple
						placeholder='Lọc theo khóa sinh viên'
					/>
				</Form.Item>
			</Col>
			<Col span={24} md={6}>
				<Form.Item label='Ngành đào tạo'>
					<SelectNganhCoSo
						condition={{ maTrinhDo: recTrinhDo?.ma }}
						onChange={(val) =>
							setMaNganhList(
								Array.isArray(val)
									? danhSachNganh.filter((item) => val.includes(item.ma)).map((item) => item.ma)
									: undefined,
							)
						}
						allowClear
						selectMa
						multiple
						placeholder='Lọc theo ngành đào tạo'
					/>
				</Form.Item>
			</Col>

			{/* {!maKhoaList?.length && !maNganhList?.length ? (
				<Col span={24}>
					<i className='text-error'>Vui lòng chọn khóa hoặc ngành trước</i>
				</Col>
			) : null} */}

			<Col span={24}>
				<TableStaticData
					data={_.uniqBy(danhSach, (item) => item.ma)}
					columns={columns}
					loading={loading}
					addStt
					size='small'
					hasTotal
					otherProps={{
						rowKey: (rec: KhoaNganh.IRecord) => rec.ma,
						rowSelection: {
							selectedRowKeys: value ?? [],
							onChange: (keys) => onChange && onChange(keys as string[]),
							preserveSelectedRowKeys: true,
							columnWidth: 40,
						},
						pagination: false,
					}}
					otherButtons={
						value?.length
							? [
									<div key='1'>
										Đã chọn {value?.length} khóa ngành{' '}
										<a style={{ color: 'red', cursor: 'pointer' }} onClick={() => onChange && onChange([])}>
											(Bỏ chọn tất cả)
										</a>
									</div>,
								]
							: undefined
					}
				/>
			</Col>
		</Row>
	);
};

export default FormItemKhoaNganh;
