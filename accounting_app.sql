drop database if exists accounting_app;
create database accounting_app;
use accounting_app;

create table _user(
	id int primary key auto_increment not null,
	username varchar(255) unique,
    _password varchar(255),
    email varchar(255) unique
);

create table _profile(
    _user_id int primary key not null,
    first_name varchar(255),
    last_name varchar(255),
	  img longtext,
    age varchar(255)
);

create table income(
	id int primary key auto_increment not null,
	_name varchar(255) default 'Income',
	_sum float(8,2),
	_date timestamp default current_timestamp,
	#  YYYYMMDDHHMMSS 2009-06-04 18:13:56 
	notes varchar(255),
    category varchar(255) default null,
	_user_id int,
	sourse_id int,
    saves_id int
);

create table outcome(
	id int primary key auto_increment not null,
	_name varchar(255) default 'Outcome',
    _sum float(8,2),
	_date timestamp default current_timestamp,
	notes varchar(255),
    sourse varchar(255) default null,
	_user_id int,
	category_id int,
	saves_id int
);

create table sourse(
	id int primary key auto_increment not null,
	_name varchar(255),
	_user_id int,
    active boolean default 1 
);

create table category(
	id int primary key auto_increment not null,
	_name varchar(255),
	_user_id int,
    active boolean default 1,
    icon_id int default 1
);

create table saves(
	id int primary key auto_increment not null,
	_name varchar(255),
	_sum float(8,2),
    _user_id int,
    active boolean default 1,
    icon_id int default 1
);

create table icons(
	id int primary key auto_increment not null,
    src varchar(255),
    _type varchar(255)
);

alter table _profile add constraint fk_profile_user
foreign key (_user_id) references _user(id) ON DELETE CASCADE ON UPDATE NO ACTION;

alter table income add constraint fk_income_user
foreign key (_user_id) references _user(id) ON DELETE CASCADE ON UPDATE NO ACTION;

alter table income add constraint fk_income_sourse
foreign key (sourse_id) references sourse(id) ON DELETE SET NULL ON UPDATE NO ACTION;

alter table income add constraint fk_income_saves
foreign key (saves_id) references saves(id) ON DELETE SET NULL ON UPDATE NO ACTION;

alter table outcome add constraint fk_outcome_category
foreign key (category_id ) references category(id) ON DELETE SET NULL ON UPDATE NO ACTION;

alter table outcome add constraint fk_outcome_user
foreign key (_user_id) references _user(id) ON DELETE CASCADE ON UPDATE NO ACTION;

alter table outcome add constraint fk_outcome_saves
foreign key (saves_id) references saves(id) ON DELETE SET NULL ON UPDATE NO ACTION;

alter table category add constraint fk_category_user
foreign key (_user_id) references _user(id) ON DELETE CASCADE ON UPDATE NO ACTION;

alter table category add constraint fk_category_icons
foreign key (icon_id) references icons(id) ON DELETE CASCADE ON UPDATE NO ACTION;

alter table sourse add constraint fk_sourse_user
foreign key (_user_id) references _user(id) ON DELETE CASCADE ON UPDATE NO ACTION;

alter table saves add constraint fk_saves_user
foreign key (_user_id) references _user(id) ON DELETE CASCADE ON UPDATE NO ACTION;

alter table saves add constraint fk_saves_icons
foreign key (icon_id) references icons(id) ON DELETE CASCADE ON UPDATE NO ACTION;

delimiter |

CREATE TRIGGER income_save AFTER INSERT ON income
  FOR EACH ROW
  BEGIN
    UPDATE saves SET _sum = NEW._sum + _sum WHERE _user_id = NEW._user_id AND id = NEW.saves_id;
  END;
|

delimiter ;

delimiter |

CREATE TRIGGER outcome_save AFTER INSERT ON outcome
  FOR EACH ROW
  BEGIN
    UPDATE saves SET _sum = _sum - NEW._sum WHERE _user_id = NEW._user_id AND id = NEW.saves_id;
  END;
|

delimiter ;

delimiter |

CREATE TRIGGER create_profile AFTER INSERT ON _user
  FOR EACH ROW
  BEGIN
	INSERT INTO _profile (_user_id, first_name, last_name, age, img) VALUES (NEW.id, '', '', '', '');
  
    INSERT INTO sourse (`_name`, `_user_id`) VALUES ('Work', NEW.id);
    INSERT INTO sourse (`_name`, `_user_id`) VALUES ('Present', NEW.id);
    INSERT INTO sourse (`_name`, `_user_id`) VALUES ('Deposite', NEW.id);
    
    INSERT INTO category (`_name`, `_user_id`, `icon_id`) VALUES ('Auto', NEW.id, 2);
    INSERT INTO category (`_name`, `_user_id`, `icon_id`) VALUES ('Food', NEW.id, 7);
    INSERT INTO category (`_name`, `_user_id`, `icon_id`) VALUES ('House', NEW.id, 12);
    INSERT INTO category (`_name`, `_user_id`, `icon_id`) VALUES ('Entertainment', NEW.id, 6);
    
    INSERT INTO saves (`_name`, `_sum`, `_user_id`, `icon_id`) VALUES ('Cash', '0', NEW.id, 32);
    INSERT INTO saves (`_name`, `_sum`, `_user_id`, `icon_id`) VALUES ('Bank', '0', NEW.id, 35);
    INSERT INTO saves (`_name`, `_sum`, `_user_id`, `icon_id`) VALUES ('MasterCard', '0', NEW.id, 33);
  END;
|

delimiter ;

INSERT INTO icons (`src`, `_type`) VALUES ('img/icon.png', 'default'), ('img/auto.png', 'category'), ('img/church.png', 'category'), ('img/clothes.png', 'category'), ('img/dog.png', 'category'), ('img/entertainment.png', 'category'), ('img/food.png', 'category'), ('img/furniture.png', 'category'), ('img/gadget.png', 'category'), ('img/guitar.png', 'category'), ('img/heart.png', 'category'), ('img/home.png', 'category'), ('img/hook.png', 'category'), ('img/hurt.png', 'category'), ('img/museum.png', 'category'), ('img/paint.png', 'category'), ('img/pet.png', 'category'), ('img/phone.png', 'category'), ('img/plane.png', 'category'), ('img/present.png', 'category'), ('img/dog.png', 'category'),('img/relaxation.png', 'category'), ('img/ship.png', 'category'), ('img/sport.png', 'category'), ('img/streetcar.png', 'category'), ('img/syringe.png', 'category'), ('img/uah.png', 'saves'), ('img/ruble.png', 'saves'), ('img/euro.png', 'saves'), ('img/dolar.png', 'saves'), ('img/deposite.png', 'saves'), ('img/cash.png', 'saves'), ('img/card.png', 'saves'), ('img/bitcoin.png', 'saves'), ('img/bank.png', 'saves');