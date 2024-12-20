"""Second commit

Revision ID: b33664576026
Revises: 
Create Date: 2024-11-21 10:50:35.984354

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'b33664576026'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('contents', schema=None) as batch_op:
        batch_op.alter_column('content_doc_path',
               existing_type=sa.VARCHAR(length=500),
               nullable=False)
        batch_op.alter_column('content_video_path',
               existing_type=sa.VARCHAR(length=500),
               nullable=False)
        batch_op.alter_column('content_video_duration',
               existing_type=sa.VARCHAR(length=5),
               nullable=False)
        batch_op.drop_constraint('contents_content_video_path_key', type_='unique')

    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.alter_column('course_description',
               existing_type=sa.TEXT(),
               type_=sa.String(length=1000),
               nullable=False)

    with op.batch_alter_table('email_update_request', schema=None) as batch_op:
        batch_op.alter_column('expire_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False)

    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.alter_column('notification_id',
               existing_type=sa.UUID(),
               nullable=False)

    with op.batch_alter_table('otps', schema=None) as batch_op:
        batch_op.alter_column('generated_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('now()'))
        batch_op.alter_column('expire_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text("(now() + '00:05:00'::interval)"))
        batch_op.alter_column('updated_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('now()'))

    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.alter_column('payment_mode',
               existing_type=sa.TEXT(),
               type_=sa.String(length=100),
               existing_nullable=False)
        batch_op.alter_column('payment_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=False,
               existing_server_default=sa.text('CURRENT_TIMESTAMP'))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('payments', schema=None) as batch_op:
        batch_op.alter_column('payment_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('CURRENT_TIMESTAMP'))
        batch_op.alter_column('payment_mode',
               existing_type=sa.String(length=100),
               type_=sa.TEXT(),
               existing_nullable=False)

    with op.batch_alter_table('otps', schema=None) as batch_op:
        batch_op.alter_column('updated_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))
        batch_op.alter_column('expire_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text("(now() + '00:05:00'::interval)"))
        batch_op.alter_column('generated_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True,
               existing_server_default=sa.text('now()'))

    with op.batch_alter_table('notifications', schema=None) as batch_op:
        batch_op.alter_column('notification_id',
               existing_type=sa.UUID(),
               nullable=True)

    with op.batch_alter_table('email_update_request', schema=None) as batch_op:
        batch_op.alter_column('expire_at',
               existing_type=postgresql.TIMESTAMP(timezone=True),
               nullable=True)

    with op.batch_alter_table('courses', schema=None) as batch_op:
        batch_op.alter_column('course_description',
               existing_type=sa.String(length=1000),
               type_=sa.TEXT(),
               nullable=True)

    with op.batch_alter_table('contents', schema=None) as batch_op:
        batch_op.create_unique_constraint('contents_content_video_path_key', ['content_video_path'])
        batch_op.alter_column('content_video_duration',
               existing_type=sa.VARCHAR(length=5),
               nullable=True)
        batch_op.alter_column('content_video_path',
               existing_type=sa.VARCHAR(length=500),
               nullable=True)
        batch_op.alter_column('content_doc_path',
               existing_type=sa.VARCHAR(length=500),
               nullable=True)

    # ### end Alembic commands ###
