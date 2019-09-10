setInterval(() => {

	loot();
	if (character.hp <= character.max_hp - 100, character.mp <= character.max_mp - 100) {
		use_hp_or_mp();
	}
	getMonster();

}, 250);


function getMonster() {
	let target = get_targeted_monster();

	if (!target) {
		set_message("Finding target.");
		target = get_nearest_monster({
			min_xp: character.max_xp / 500,
			max_att: character.max_hp / 5
		});

		if (target) {
			set_message(`Target: ${target.name}`);
			change_target(target);
		} else {
			set_message("No monsters meet requirements");
		}
	}


	const [x1, y1] = [character.x, character.y];
	const [x2, y2] = [target.x, target.y];
	const [xd, yd] = [x1 - x2, y1 - y2];
	const buffer = target.range + target.speed;

	// xd, yd = distance between x1 - x2, y1 - y2
	// monster east if = pos xd
	// monster north of = pos yd
	// monster west of = neg xd
	// monster south of = neg yd

	let [newX, newY] = [x1, y1];

	seeRanges(x1, y1, character.range, x2, y2, target.range);

	if (parent.distance(character, target) > character.range) {
		set_message(`Moving closer to ${target.name}`);
		[newX, newY] = [x2, y2];
		if (can_move_to(newX, newY)) {
			move(newX, newY);
		};
	} else if (can_attack(target)) {
		set_message("Attacking " + target.name);
		attack(target);
	}

	if (parent.distance(character, target) <= target.range) {
		if (xd < 0) {
			newX = x1 - buffer; // left
		} else {
			newX = x1 + buffer; // right
		}

		if (yd < 0) {
			newY = y1 - buffer; // up
		} else {
			newY = y1 + buffer; // down
		}

		if (can_move_to(newX, newY)) {
			move(newX, newY);
		} else if (can_move_to(newX, y1)) {
			move(newX, y1);
		} else if (can_move_to(x1, newY)) {
			move(x1, newY);
		}
	}
}

function seeRanges(x1, y1, r1, x2, y2, r2) {
	clear_drawings();

	draw_circle(x1, y1, r1, .5, 0xE8FF00);
	draw_circle(x2, y2, r2, .5, 0xE22B2B);
}
