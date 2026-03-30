-- ============================================================
--  MCU UNIVERSE DATABASE
--  Đồ án giữa kỳ — CodeIgniter 3 + MySQL
--  Import: phpMyAdmin > Import > chọn file này
-- ============================================================

CREATE DATABASE IF NOT EXISTS `mcu_database`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE `mcu_database`;

-- ─────────────────────────────────────────────────────────────
--  BẢNG phases
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `phases` (
    `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `phase_num`   TINYINT         NOT NULL COMMENT '1 – 6',
    `ten_phase`   VARCHAR(120)    NOT NULL,
    `saga`        VARCHAR(80)     NOT NULL COMMENT 'Infinity Saga / Multiverse Saga',
    `years`       VARCHAR(20)     NOT NULL COMMENT 'VD: 2008 – 2012',
    `mo_ta`       TEXT            NOT NULL,
    `film_count`  TINYINT         NOT NULL DEFAULT 0,
    `phase_hue`   SMALLINT        NOT NULL DEFAULT 0 COMMENT 'CSS hue cho accent color',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uq_phase_num` (`phase_num`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  BẢNG movies
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `movies` (
    `id`          INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `slug`        VARCHAR(100)    NOT NULL UNIQUE,
    `title`       VARCHAR(200)    NOT NULL,
    `year`        SMALLINT        NOT NULL,
    `duration`    VARCHAR(30)     NOT NULL COMMENT 'VD: 126 phút',
    `rating`      DECIMAL(3,1)    NOT NULL DEFAULT 0.0,
    `box_office`  VARCHAR(20)     NOT NULL DEFAULT '—',
    `director`    VARCHAR(150)    NOT NULL DEFAULT '—',
    `cast_list`   TEXT            NOT NULL,
    `description` TEXT            NOT NULL,
    `tagline`     VARCHAR(255)    NOT NULL DEFAULT '',
    `bg_color`    VARCHAR(10)     NOT NULL DEFAULT '#333333',
    `poster_url`  VARCHAR(500)    NOT NULL DEFAULT '',
    `type`        ENUM('movie','series','special') NOT NULL DEFAULT 'movie',
    `view_order`  SMALLINT        NOT NULL DEFAULT 0 COMMENT 'Thứ tự xem theo timeline',
    `phase_id`    INT UNSIGNED    NOT NULL,
    PRIMARY KEY (`id`),
    KEY `idx_phase` (`phase_id`),
    KEY `idx_type`  (`type`),
    KEY `idx_order` (`view_order`),
    CONSTRAINT `fk_movie_phase`
        FOREIGN KEY (`phase_id`) REFERENCES `phases` (`id`)
        ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─────────────────────────────────────────────────────────────
--  BẢNG characters
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `characters` (
    `id`              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
    `slug`            VARCHAR(80)     NOT NULL UNIQUE,
    `name`            VARCHAR(100)    NOT NULL,
    `alter_ego`       VARCHAR(150)    NOT NULL DEFAULT '',
    `status`          ENUM('active','deceased','unknown','special')
                                      NOT NULL DEFAULT 'active',
    `status_label`    VARCHAR(80)     NOT NULL DEFAULT 'Đang hoạt động',
    `bg_color`        VARCHAR(10)     NOT NULL DEFAULT '#333333',
    `avatar_initials` VARCHAR(4)      NOT NULL DEFAULT '',
    `phase_1`         TINYINT(1)      NOT NULL DEFAULT 0,
    `phase_2`         TINYINT(1)      NOT NULL DEFAULT 0,
    `phase_3`         TINYINT(1)      NOT NULL DEFAULT 0,
    `phase_4`         TINYINT(1)      NOT NULL DEFAULT 0,
    `phase_5`         TINYINT(1)      NOT NULL DEFAULT 0,
    `phase_6`         TINYINT(1)      NOT NULL DEFAULT 0,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ============================================================
--  SEED DATA
-- ============================================================

-- ─── phases ──────────────────────────────────────────────────
INSERT INTO `phases`
    (`id`, `phase_num`, `ten_phase`, `saga`, `years`, `mo_ta`, `film_count`, `phase_hue`)
VALUES
(1, 1, 'The Beginning',      'Infinity Saga',   '2008 – 2012', 'Khởi đầu vũ trụ với Iron Man, Thor, Hulk và cuộc hội tụ Avengers đầu tiên.', 6, 0),
(2, 2, 'Expansion',          'Infinity Saga',   '2013 – 2015', 'Mở rộng vũ trụ với Guardians of the Galaxy và những mối đe dọa mới.', 6, 20),
(3, 3, 'The Infinity War',   'Infinity Saga',   '2016 – 2019', 'Thanos — cuộc chiến Infinity War và Endgame thay đổi vũ trụ mãi mãi.', 11, 340),
(4, 4, 'New World',          'Multiverse Saga', '2021 – 2022', 'Hậu Endgame — multiverse mở ra, những anh hùng mới trỗi dậy.', 7, 200),
(5, 5, 'The Kang Dynasty',   'Multiverse Saga', '2023 – 2025', 'Dòng thời gian bị chia rẽ và sự trỗi dậy của các phe phái mới.', 6, 260),
(6, 6, 'Secret Wars',        'Multiverse Saga', '2025 – 2027', 'Avengers: Secret Wars — cuộc hội tụ vĩ đại nhất lịch sử MCU.', 4, 170);

-- ─── movies ──────────────────────────────────────────────────
INSERT INTO `movies`
    (`id`, `slug`, `title`, `year`, `duration`, `rating`, `box_office`, `director`, `cast_list`, `description`, `tagline`, `bg_color`, `poster_url`, `type`, `view_order`, `phase_id`)
VALUES
-- Phase 1
(1, 'iron-man', 'Iron Man', 2008, '126 phút', 8.0, '$585M', 'Jon Favreau', 'Robert Downey Jr., Gwyneth Paltrow, Terrence Howard', 'Tony Stark chế tạo bộ giáp đầu tiên để thoát khỏi tù giam và trở thành Iron Man.', 'Genius. Billionaire. Playboy. Philanthropist.', '#C0392B', 'assets/images/posters/iron-man.jpg', 'movie', 1, 1),
(2, 'incredible-hulk', 'The Incredible Hulk', 2008, '112 phút', 6.7, '$264M', 'Louis Leterrier', 'Edward Norton, Liv Tyler, Tim Roth', 'Bruce Banner cố kiềm chế Hulk trong khi bị quân đội truy đuổi. Abomination nổi dậy.', 'This is not who I am.', '#27AE60', 'assets/images/posters/incredible-hulk.jpg', 'movie', 2, 1),
(3, 'iron-man-2', 'Iron Man 2', 2010, '124 phút', 7.0, '$624M', 'Jon Favreau', 'Robert Downey Jr., Mickey Rourke, Gwyneth Paltrow', 'Tony phải đối mặt với chính phủ, kẻ thù mới Whiplash, và chất độc palladium.', 'I am Iron Man.', '#E74C3C', 'assets/images/posters/iron-man-2.jpg', 'movie', 3, 1),
(4, 'thor', 'Thor', 2011, '115 phút', 7.0, '$449M', 'Kenneth Branagh', 'Chris Hemsworth, Natalie Portman, Tom Hiddleston', 'Thor bị trục xuất khỏi Asgard xuống Trái Đất, phải chứng minh bản thân xứng đáng cầm búa Mjolnir.', 'Two worlds. One hero.', '#1A5276', 'assets/images/posters/thor.jpg', 'movie', 4, 1),
(5, 'captain-america-first-avenger', 'Captain America: The First Avenger', 2011, '124 phút', 7.3, '$371M', 'Joe Johnston', 'Chris Evans, Hayley Atwell, Hugo Weaving', 'Steve Rogers trở thành Super-Soldier, chiến đấu chống lại HYDRA và Red Skull trong Thế chiến II.', 'Not a perfect soldier, but a good man.', '#154360', 'assets/images/posters/captain-america-first-avenger.jpg', 'movie', 5, 1),
(6, 'avengers', 'The Avengers', 2012, '143 phút', 8.0, '$1.520B', 'Joss Whedon', 'Robert Downey Jr., Chris Evans, Chris Hemsworth', 'Đội hình Avengers đầu tiên hội tụ bảo vệ Trái Đất khỏi cuộc xâm lăng của phân đội Chitauri do Loki dẫn đầu.', 'There was an idea...', '#1A2980', 'assets/images/posters/avengers.jpg', 'movie', 6, 1),

-- Phase 2
(7, 'iron-man-3', 'Iron Man 3', 2013, '130 phút', 7.1, '$1.215B', 'Shane Black', 'Robert Downey Jr., Gwyneth Paltrow, Guy Pearce', 'Sau sự kiện New York, Tony Stark đối mặt với Mandarin và Extremis.', 'We make our own demons.', '#922B21', 'assets/images/posters/iron-man-3.jpg', 'movie', 7, 2),
(8, 'thor-dark-world', 'Thor: The Dark World', 2013, '112 phút', 6.8, '$644M', 'Alan Taylor', 'Chris Hemsworth, Natalie Portman, Tom Hiddleston', 'Thor phải hợp tác với Loki để ngăn chặn tộc Dark Elf hủy diệt vũ trụ bằng Reality Stone.', 'Two worlds colliding.', '#4A235A', 'assets/images/posters/thor-dark-world.jpg', 'movie', 8, 2),
(9, 'captain-america-winter-soldier', 'Captain America: The Winter Soldier', 2014, '136 phút', 7.8, '$714M', 'Anthony Russo, Joe Russo', 'Chris Evans, Scarlett Johansson, Sebastian Stan', 'Steve Rogers khám phá ra SHIELD đã bị HYDRA thâm nhập, và đối mặt với sát thủ Winter Soldier.', 'In heroes we trust.', '#1B4F72', 'assets/images/posters/captain-america-winter-soldier.jpg', 'movie', 9, 2),
(10, 'guardians-of-the-galaxy', 'Guardians of the Galaxy', 2014, '121 phút', 8.0, '$773M', 'James Gunn', 'Chris Pratt, Zoe Saldana, Dave Bautista', 'Một nhóm tội phạm không gian phải hợp tác để ngăn chặn Ronan phá hủy hành tinh Xandar.', 'We are Groot.', '#6D4C8E', 'assets/images/posters/guardians-of-the-galaxy.jpg', 'movie', 10, 2),
(11, 'avengers-age-of-ultron', 'Avengers: Age of Ultron', 2015, '141 phút', 7.3, '$1.405B', 'Joss Whedon', 'Robert Downey Jr., Chris Evans, Chris Hemsworth', 'Tony Stark tạo ra AI Ultron, nhưng nó quyết định tiêu diệt nhân loại.', 'There are no strings on me.', '#2C3E50', 'assets/images/posters/avengers-age-of-ultron.jpg', 'movie', 11, 2),
(12, 'ant-man', 'Ant-Man', 2015, '117 phút', 7.3, '$519M', 'Peyton Reed', 'Paul Rudd, Michael Douglas, Evangeline Lilly', 'Tên trộm Scott Lang sử dụng bộ đồ thu nhỏ của Hank Pym để thực hiện một vụ trộm giải cứu thế giới.', 'Heroes don''t get any bigger.', '#7B241C', 'assets/images/posters/ant-man.jpg', 'movie', 12, 2),

-- Phase 3
(13, 'captain-america-civil-war', 'Captain America: Civil War', 2016, '147 phút', 7.8, '$1.153B', 'Anthony Russo, Joe Russo', 'Chris Evans, Robert Downey Jr., Scarlett Johansson', 'Hiệp định Sokovia chia rẽ Avengers thành hai phe đối lập do Cap và Iron Man dẫn đầu.', 'United we stand. Divided we fall.', '#2E4057', 'assets/images/posters/captain-america-civil-war.jpg', 'movie', 13, 3),
(14, 'doctor-strange', 'Doctor Strange', 2016, '115 phút', 7.5, '$677M', 'Scott Derrickson', 'Benedict Cumberbatch, Chiwetel Ejiofor, Rachel McAdams', 'Bác sĩ phẫu thuật Stephen Strange học phép thuật và bảo vệ Trái Đất khỏi các thế lực thần bí.', 'Open your mind.', '#F39C12', 'assets/images/posters/doctor-strange.jpg', 'movie', 14, 3),
(15, 'guardians-of-the-galaxy-vol-2', 'Guardians of the Galaxy Vol. 2', 2017, '136 phút', 7.6, '$863M', 'James Gunn', 'Chris Pratt, Zoe Saldana, Dave Bautista', 'Nhóm Guardians khám phá nguồn gốc thực sự của Peter Quill và đối mặt với Ego.', 'Obviously.', '#884EA0', 'assets/images/posters/guardians-of-the-galaxy-vol-2.jpg', 'movie', 15, 3),
(16, 'spider-man-homecoming', 'Spider-Man: Homecoming', 2017, '133 phút', 7.4, '$880M', 'Jon Watts', 'Tom Holland, Michael Keaton, Robert Downey Jr.', 'Peter Parker cố gắng cân bằng cuộc sống học đường và trách nhiệm siêu anh hùng dưới sự giám sát của Tony Stark.', 'Homework can wait. The city can''t.', '#CB4335', 'assets/images/posters/spider-man-homecoming.jpg', 'movie', 16, 3),
(17, 'thor-ragnarok', 'Thor: Ragnarok', 2017, '130 phút', 7.9, '$853M', 'Taika Waititi', 'Chris Hemsworth, Tom Hiddleston, Cate Blanchett', 'Thor bị đày đến Sakaar và phải tham gia đấu trường giác đấu để trở về cứu Asgard khỏi Hela.', 'No hammer. No problem.', '#A569BD', 'assets/images/posters/thor-ragnarok.jpg', 'movie', 17, 3),
(18, 'black-panther', 'Black Panther', 2018, '134 phút', 7.3, '$1.347B', 'Ryan Coogler', 'Chadwick Boseman, Michael B. Jordan, Lupita Nyong''o', 'T''Challa trở về Wakanda để lên ngôi vua nhưng phải đối mặt với Killmonger.', 'Wakanda Forever.', '#1A237E', 'assets/images/posters/black-panther.jpg', 'movie', 18, 3),
(19, 'avengers-infinity-war', 'Avengers: Infinity War', 2018, '149 phút', 8.4, '$2.048B', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans, Chris Hemsworth', 'Thanos thu thập 6 viên đá Vô Cực để thực hiện cú búng tay xóa sổ một nửa sinh linh vũ trụ.', 'An entire universe. Once and for all.', '#4A235A', 'assets/images/posters/avengers-infinity-war.jpg', 'movie', 19, 3),
(20, 'ant-man-and-wasp', 'Ant-Man and the Wasp', 2018, '118 phút', 7.0, '$622M', 'Peyton Reed', 'Paul Rudd, Evangeline Lilly, Michael Douglas', 'Scott Lang cố gắng cân bằng cuộc sống gia đình và trách nhiệm làm siêu anh hùng, trong khi Hope van Dyne và Hank Pym đưa ra một nhiệm vụ mới khẩn cấp.', 'Real heroes. Not actual size.', '#7B241C', 'assets/images/posters/ant-man-and-wasp.jpg', 'movie', 20, 3),
(21, 'captain-marvel', 'Captain Marvel', 2019, '123 phút', 6.8, '$1.128B', 'Anna Boden, Ryan Fleck', 'Brie Larson, Samuel L. Jackson, Ben Mendelsohn', 'Carol Danvers trở thành một trong những anh hùng mạnh nhất vụ trụ khi Trái Đất bị cuốn vào cuộc chiến giữa hai tộc người ngoài hành tinh.', 'Higher. Further. Faster.', '#C0392B', 'assets/images/posters/captain-marvel.jpeg', 'movie', 21, 3),
(22, 'avengers-endgame', 'Avengers: Endgame', 2019, '181 phút', 8.4, '$2.798B', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Chris Evans, Chris Hemsworth', 'Các Avengers sống sót quay ngược thời gian để thu thập đá Vô Cực và đảo ngược cú búng tay của Thanos.', 'Whatever it takes.', '#0D0D0D', 'assets/images/posters/avengers-endgame.jpg', 'movie', 22, 3),
(23, 'spider-man-far-from-home', 'Spider-Man: Far From Home', 2019, '129 phút', 7.4, '$1.131B', 'Jon Watts', 'Tom Holland, Samuel L. Jackson, Jake Gyllenhaal', 'Hậu Endgame, Peter Parker đến châu Âu du lịch nhưng bị Nick Fury chiêu mộ để đối đầu với nhóm Elementals.', 'It''s time to step up.', '#2874A6', 'assets/images/posters/spider-man-far-from-home.jpg', 'movie', 23, 3),

-- Phase 4
(24, 'black-widow', 'Black Widow', 2021, '134 phút', 6.7, '$379M', 'Cate Shortland', 'Scarlett Johansson, Florence Pugh, David Harbour', 'Natasha Romanoff đối mặt với quá khứ đen tối của mình và tổ chức Red Room.', 'She''s done running from her past.', '#641E16', 'assets/images/posters/black-widow.png', 'movie', 24, 4),
(25, 'shang-chi', 'Shang-Chi and the Legend of the Ten Rings', 2021, '132 phút', 7.4, '$432M', 'Destin Daniel Cretton', 'Simu Liu, Awkwafina, Tony Leung', 'Shang-Chi phải đối mặt với quá khứ và di sản gia đình khi anh bị cuốn vào tổ chức Ten Rings.', 'A Marvel Legend Will Rise.', '#9C640C', 'assets/images/posters/shang-chi.jpg', 'movie', 25, 4),
(26, 'eternals', 'Eternals', 2021, '156 phút', 6.3, '$402M', 'Chloé Zhao', 'Gemma Chan, Richard Madden, Angelina Jolie', 'Tộc người bất tử Eternals bước ra khỏi bóng tối để bảo vệ Trái Đất khỏi các Deviants.', 'In the beginning...', '#D4AC0D', 'assets/images/posters/eternals.jpeg', 'movie', 26, 4),
(27, 'spider-man-no-way-home', 'Spider-Man: No Way Home', 2021, '148 phút', 8.2, '$1.921B', 'Jon Watts', 'Tom Holland, Zendaya, Benedict Cumberbatch', 'Peter Parker nhờ Doctor Strange xóa ký ức mọi người, nhưng phép thuật lỗi làm vỡ Đa vũ trụ.', 'Multiverse unleashed.', '#E74C3C', 'assets/images/posters/spider-man-no-way-home.jpg', 'movie', 27, 4),
(28, 'doctor-strange-multiverse', 'Doctor Strange in the Multiverse of Madness', 2022, '126 phút', 6.9, '$955M', 'Sam Raimi', 'Benedict Cumberbatch, Elizabeth Olsen, Xochitl Gomez', 'Doctor Strange hợp tác cùng America Chavez để chạy trốn khỏi sự truy sát của Scarlet Witch qua Đa vũ trụ.', 'Enter a new dimension of Strange.', '#7B241C', 'assets/images/posters/doctor-strange-multiverse.jpg', 'movie', 28, 4),
(29, 'thor-love-and-thunder', 'Thor: Love and Thunder', 2022, '119 phút', 6.2, '$760M', 'Taika Waititi', 'Chris Hemsworth, Natalie Portman, Christian Bale', 'Thor hợp tác với Jane Foster (Mighty Thor) để đánh bại Gorr the God Butcher.', 'The one and only.', '#3498DB', 'assets/images/posters/thor-love-and-thunder.jpg', 'movie', 29, 4),
(30, 'black-panther-wakanda-forever', 'Black Panther: Wakanda Forever', 2022, '161 phút', 6.7, '$859M', 'Ryan Coogler', 'Letitia Wright, Lupita Nyong''o, Tenoch Huerta', 'Wakanda tang thương sau cái chết của vua T''Challa và phải đối mặt với vương quốc Talokan dưới biển sâu do Namor lãnh đạo.', 'Forever.', '#1A237E', 'assets/images/posters/black-panther-wakanda-forever.jpg', 'movie', 30, 4),

-- Phase 5
(31, 'ant-man-quantumania', 'Ant-Man and the Wasp: Quantumania', 2023, '125 phút', 6.1, '$476M', 'Peyton Reed', 'Paul Rudd, Evangeline Lilly, Jonathan Majors', 'Scott Lang cùng gia đình bị kéo vào Lượng Tử Giới và đối mặt với Kang the Conqueror.', 'Witness the beginning of a new dynasty.', '#1F618D', 'assets/images/posters/ant-man-quantumania.jpg', 'movie', 31, 5),
(32, 'guardians-vol-3', 'Guardians of the Galaxy Vol. 3', 2023, '150 phút', 7.9, '$845M', 'James Gunn', 'Chris Pratt, Zoe Saldana, Chukwudi Iwuji', 'Nhóm Guardians đối mặt với High Evolutionary để cứu lấy mạng sống của Rocket.', 'Once more with feeling.', '#922B21', 'assets/images/posters/guardians-vol-3.jpg', 'movie', 32, 5),
(33, 'the-marvels', 'The Marvels', 2023, '105 phút', 5.5, '$206M', 'Nia DaCosta', 'Brie Larson, Teyonah Parris, Iman Vellani', 'Sức mạnh của Captain Marvel, Monica Rambeau và Ms. Marvel bị tráo đổi, buộc họ phải hợp tác giải quyết sự cố.', 'Higher. Further. Faster. Together.', '#A569BD', 'assets/images/posters/the-marvels.jpg', 'movie', 33, 5),
(34, 'deadpool-and-wolverine', 'Deadpool & Wolverine', 2024, '127 phút', 8.0, '$1.338B', 'Shawn Levy', 'Ryan Reynolds, Hugh Jackman, Emma Corrin', 'TVA bắt giữ Deadpool và ép anh hợp tác với biến thể Wolverine xui xẻo nhất để rẽ nhánh sự kiện cứu dòng thời gian của anh.', 'Best Bubs.', '#C0392B', 'assets/images/posters/deadpool-and-wolverine.jpg', 'movie', 34, 5),
(35, 'captain-america-brave-new-world', 'Captain America: Brave New World', 2025, '118 phút', 0.0, 'TBA', 'Julius Onah', 'Anthony Mackie, Harrison Ford, Giancarlo Esposito', 'Sam Wilson - Tân Đội trưởng Mỹ - phải đối phó với âm mưu toàn cầu cùng sự trỗi dậy của Red Hulk.', 'TBA', '#1A5276', 'assets/images/posters/captain-america-brave-new-world.jpg', 'movie', 35, 5),
(36, 'thunderbolts', 'Thunderbolts', 2025, 'TBA', 0.0, 'TBA', 'Jake Schreier', 'Sebastian Stan, Florence Pugh, David Harbour', 'Nhóm phản anh hùng của MCU, bao gồm Bucky Barnes, Yelena Belova và U.S. Agent được chính phủ tập hợp.', 'TBA', '#2E4057', 'assets/images/posters/thunderbolts.jpg', 'movie', 36, 5),

-- Phase 6
(37, 'fantastic-four-first-steps', 'The Fantastic Four: First Steps', 2025, 'TBA', 0.0, 'TBA', 'Matt Shakman', 'Pedro Pascal, Vanessa Kirby, Joseph Quinn', 'Gia đình siêu anh hùng đầu tiên của Marvel ra mắt trong MCU, với bối cảnh thế giới tương lai-retro những năm 1960.', 'TBA', '#2E86C1', 'assets/images/posters/fantastic-four-first-steps.jpg', 'movie', 37, 6),
(38, 'spider-man-4', 'Spider-Man: Brand New Day', 2026, 'TBA', 0.0, 'TBA', 'Destin Daniel Cretton', 'Tom Holland, Zendaya', 'Peter Parker bắt đầu một chương mới tại New York sau khi cả thế giới quên đi thân phận của cậu.', 'TBA', '#E23636', 'assets/images/posters/spider-man-4.webp', 'movie', 38, 6),
(39, 'avengers-doomsday', 'Avengers: Doomsday', 2026, 'TBA', 0.0, 'TBA', 'Anthony Russo, Joe Russo', 'Robert Downey Jr., Pedro Pascal', 'Cuộc đại chiến bản lề của Multiverse Saga với The Fantastic Four đối đầu cùng Victor Von Doom hay còn gọi là Doctor Doom.', 'Doom is inevitable.', '#1a1a1a', 'assets/images/posters/avengers-doomsday.jpg', 'movie', 39, 6),
(40, 'avengers-secret-wars', 'Avengers: Secret Wars', 2027, 'TBA', 0.0, 'TBA', 'Anthony & Joe Russo', 'Robert Downey Jr., Pedro Pascal', 'Trận chiến hoành tráng nhất khép lại Kỷ nguyên Đa vũ trụ (Multiverse Saga) khi các thế giới va chạm vào nhau.', 'TBA', '#A91D22', 'assets/images/posters/avengers-secret-wars.jpg', 'movie', 40, 6);

-- ─── characters ──────────────────────────────────────────────
INSERT INTO `characters`
    (`slug`, `name`, `alter_ego`, `status`, `status_label`,
     `bg_color`, `avatar_initials`,
     `phase_1`, `phase_2`, `phase_3`, `phase_4`, `phase_5`, `phase_6`)
VALUES
('iron-man',         'Iron Man',        'Tony Stark',                'deceased', 'Đã hi sinh · Endgame',
 '#E23636', 'IM', 1, 1, 1, 0, 0, 0),

('captain-america',  'Captain America', 'Steve Rogers → Sam Wilson', 'active',   'Đang hoạt động',
 '#2E86C1', 'CA', 1, 1, 1, 1, 1, 0),

('thor',             'Thor Odinson',    'God of Thunder',            'active',   'Đang hoạt động',
 '#1A5276', 'TH', 1, 1, 1, 1, 1, 0),

('scarlet-witch',    'Scarlet Witch',   'Wanda Maximoff',            'unknown',  'Không xác định',
 '#922B21', 'SW', 0, 1, 1, 1, 0, 0),

('doctor-strange',   'Doctor Strange',  'Stephen Strange',           'active',   'Đang hoạt động',
 '#F39C12', 'DS', 0, 0, 1, 1, 1, 0),

('spider-man',       'Spider-Man',      'Peter Parker',              'active',   'Đang hoạt động',
 '#E74C3C', 'SP', 0, 0, 1, 1, 1, 1),

('loki',             'Loki',            'God of Mischief',           'special',  'God of Stories',
 '#1E8449', 'LK', 1, 1, 1, 1, 1, 0),

('thanos',           'Thanos',          'The Mad Titan',             'deceased', 'Đã bị tiêu diệt',
 '#6C3483', 'TN', 0, 1, 1, 0, 0, 0);
