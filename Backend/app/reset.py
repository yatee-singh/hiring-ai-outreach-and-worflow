
import uuid

from passlib.context import CryptContext

from app.db.database import engine, Base, SessionLocal
from app.db.models import User, Organization


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def reset_database():
    print("Dropping tables...")

    Base.metadata.drop_all(bind=engine)

    print("Creating tables...")

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Create organization
        organization = Organization(
            name="testcompany",
        )

        db.add(organization)
        db.flush()

        # Create default user
        user = User(
            username="yatee",
            password_hash=pwd_context.hash("test123"),
            name="Yatee Singh",
            role="ADMIN",
            organization_id=organization.id,
        )

        db.add(user)

        db.commit()

        print("\nDefault data created:")
        print(f"Organization: {organization.name}")
        print(f"Organization ID: {organization.id}")
        print(f"User: {user.username}")
        print("Password: test123")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()

    print("\nDatabase reset complete!")


if __name__ == "__main__":
    reset_database()

