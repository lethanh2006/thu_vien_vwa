import ButtonExtend from '@/components/Table/ButtonExtend';
import { colorTrangThaiGhiNhanAnPhamDinhKy, ETrangThaiGhiNhanAnPhamDinhKy } from '@/services/AnPhamDinhKy/constant';
import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import rules from '@/utils/rules';
import { resetFieldsForm } from '@/utils/utils';
import { Button, Card, Col, Form, Row, Tag } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl, useModel } from 'umi';
import SelectAnPhamDinhKy from '../../AnPhamDinhKy/components/Select';
import FormGhiNhanAnPham from '../../GhiNhan/components/Form';

const CardFormGhiNhan = (props: any) => {
	const { getData: getDataExternal } = props;
	const intl = useIntl();
	const [form] = Form.useForm();
	const { getModel, formSubmiting, postModel, visibleForm, setVisibleForm, record, edit, isView, putModel } =
		useModel('anphamdinhky.ghinhan');
	const [actionType, setActionType] = useState<ETrangThaiGhiNhanAnPhamDinhKy>();

	const getData = () => {
		if (getDataExternal) {
			getDataExternal();
		} else getModel();
	};

	useEffect(() => {
		if (!visibleForm) {
			resetFieldsForm(form);
		} else if (record?._id) {
			form.setFieldsValue(record);
		}

		if (!record?._id) {
			form.setFieldsValue({
				ngayGhiNhan: moment(),
			});
		}
	}, [visibleForm, record?._id]);

	const onFinish = async (values: AnPhamDinhKy.GhiNhanAnPhamDinhKy) => {
		const data = {
			...values,
			ngayGhiNhan: moment(values.ngayGhiNhan).startOf('d').toISOString(),
			trangThaiGhiNhan: actionType,
		};

		if (edit) {
			putModel(record?._id ?? '', data, getData)
				.then()
				.catch((er) => console.log(er));
		} else
			postModel(data, getData)
				.then()
				.catch((er) => console.log(er));
	};

	return (
		<Card title={`${edit ? 'Chỉnh sửa' : isView ? 'Chi tiết' : 'Thêm mới'} ghi nhận ấn phẩm định kỳ`}>
			<Form onFinish={onFinish} form={form} layout='vertical'>
				<Row gutter={[12, 0]}>
					{record?._id && (
						<Col span={24} style={{ marginBottom: 12 }}>
							Trạng thái:{' '}
							<Tag color={colorTrangThaiGhiNhanAnPhamDinhKy[record?.trangThaiGhiNhan as ETrangThaiGhiNhanAnPhamDinhKy]}>
								{record?.trangThaiGhiNhan}
							</Tag>
						</Col>
					)}
					<Col span={24}>
						<Form.Item name='anPhamDinhKyId' label='Ấn phẩm định kỳ' rules={[...rules.required]}>
							<SelectAnPhamDinhKy disabled={edit} />
						</Form.Item>
					</Col>
					<FormGhiNhanAnPham />
				</Row>

				<div className='form-footer'>
					<ButtonExtend
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setActionType(ETrangThaiGhiNhanAnPhamDinhKy.DANG_GHI_NHAN);
							form.submit();
						}}
					>
						Lưu lại
					</ButtonExtend>

					<ButtonExtend
						loading={formSubmiting}
						type='primary'
						onClick={() => {
							setActionType(ETrangThaiGhiNhanAnPhamDinhKy.DA_GHI_NHAN);
							form.submit();
						}}
					>
						Ghi nhận
					</ButtonExtend>

					<Button onClick={() => setVisibleForm(false)}>{intl.formatMessage({ id: 'global.button.huy' })}</Button>
				</div>
			</Form>
		</Card>
	);
};

export default CardFormGhiNhan;
